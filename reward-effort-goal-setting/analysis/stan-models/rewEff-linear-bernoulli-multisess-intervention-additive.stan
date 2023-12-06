
data {
  int nTimes;                                // number of time points (sessions)
  int nPpts;                                 // number of participants
  int condition[nPpts];                      // intervention condition for each participant
  int nTrials_max;                           // maximum number of trials per participant per session
  int nT_ppts[nPpts, nTimes];                // actual number of trials per participant per session
  real rew1[nPpts, nTimes, nTrials_max];     // array of option1 rewards, across participants, sessions, trials   
  real eff1[nPpts, nTimes, nTrials_max];     // array of option1 efforts, across participants, sessions, trials   
  real rew2[nPpts, nTimes, nTrials_max];     // array of option2 rewards, across participants, sessions, trials     
  real eff2[nPpts, nTimes, nTrials_max];     // array of option2 efforts, across participants, sessions, trials        
  int<lower=0, upper=1> choice01[nPpts, nTimes, nTrials_max];   // chosen option (0=route 1, 1=route 2) per ppts, session, trial
}

parameters {
  // group-level correlation matrix (cholesky factor for faster computation)
  cholesky_factor_corr[nTimes] R_chol_rewSens; 
  cholesky_factor_corr[nTimes] R_chol_effSens;
  
  // group-level parameters
  // means
  vector[nTimes] mu_rewSens;                       
  vector[nTimes] mu_effSens;
  // sds
  vector<lower=0>[nTimes] sigma_rewSens;           // sigma must be positive for normal dist
  vector<lower=0>[nTimes] sigma_effSens;           // sigma must be positive for normal dist
  
  // individual-level parameters  (raw/untransformed values)
  matrix[nTimes,nPpts] rewSens_raw;
  matrix[nTimes,nPpts] effSens_raw;
  
  // group-level intervention effects
  real rewSens_int;
  real effSens_int;
}

transformed parameters {
  // individual-level parameter off-sets (for non-centered parameterization)
  matrix[nTimes,nPpts] rewSens_tilde;
  matrix[nTimes,nPpts] effSens_tilde;
  
  // individual-level parameters (transformed values)
  matrix[nPpts,nTimes] rewSens;
  matrix[nPpts,nTimes] effSens;

  // construct individual offsets (for non-centered parameterization)
  // (to get the covariance Cholesky factor from the correlation Cholesky factor, 
  // we need to multiply it by a diagonal matrix constructed from the variances 
  // of the individual variates).
  rewSens_tilde = diag_pre_multiply(sigma_rewSens, R_chol_rewSens) * rewSens_raw;
  effSens_tilde = diag_pre_multiply(sigma_effSens, R_chol_effSens) * effSens_raw;
  
  // compute individual-level parameters from non-centered parameterization
  for ( p in 1:nPpts ) {
    // time 1
    rewSens[p,1] = -1 + Phi_approx(mu_rewSens[1] + rewSens_tilde[1,p])*4;
    effSens[p,1] = -1 + Phi_approx(mu_effSens[1] + effSens_tilde[1,p])*10;
    // time 2
    if ( condition[p] == 1) {
      rewSens[p,2] = -1 + Phi_approx(mu_rewSens[2] + rewSens_tilde[2,p] + rewSens_int)*4;
      effSens[p,2] = -1 + Phi_approx(mu_effSens[2] + effSens_tilde[2,p] + effSens_int)*10;
    } else {
      rewSens[p,2] = -1 + Phi_approx(mu_rewSens[2] + rewSens_tilde[2,p])*4;
      effSens[p,2] = -1 + Phi_approx(mu_effSens[2] + effSens_tilde[2,p])*10;
    }
  }
}

model {
  // priors on cholesky factor of correlation (i.e. test-retest) matrix
  R_chol_rewSens ~ lkj_corr_cholesky(1);
  R_chol_effSens ~ lkj_corr_cholesky(1); 
  
  // define priors on distribution of group-level parameters
  // means
  mu_rewSens ~ normal(0,1);
  mu_effSens ~ normal(0,1);
  // sds
  sigma_rewSens ~ cauchy(0,1);
  sigma_effSens ~ cauchy(0,1);
  
  // define priors on individual participant deviations from group parameter values
  to_vector(rewSens_raw) ~ normal(0,1);
  to_vector(effSens_raw) ~ normal(0,1); 
  
  // intervention effects
  rewSens_int ~ normal(0,1);
  effSens_int ~ normal(0,1);
  
  // loop over observations
  for (p in 1:nPpts) {
    // define vectors of choice options at time 1 and time 2
    vector[nT_ppts[p,1]] v1_t1;
    vector[nT_ppts[p,1]] v2_t1;
    vector[nT_ppts[p,2]] v1_t2;
    vector[nT_ppts[p,2]] v2_t2;
  
    // vectorized likelihood for time 1
    v1_t1  = rewSens[p,1] * to_vector(rew1[p,1,:]) - effSens[p,1] * to_vector(eff1[p,1,:]);
    v2_t1  = rewSens[p,1] * to_vector(rew2[p,1,:]) - effSens[p,1] * to_vector(eff2[p,1,:]);
    choice01[p,1,:] ~ bernoulli_logit(v2_t1 - v1_t1);
    
    // vectorized likelihood for time 2
    v1_t2  = rewSens[p,2] * to_vector(rew1[p,2,:]) - effSens[p,2] * to_vector(eff1[p,2,:]);
    v2_t2  = rewSens[p,2] * to_vector(rew2[p,2,:]) - effSens[p,2] * to_vector(eff2[p,2,:]);
    choice01[p,2,:] ~ bernoulli_logit(v2_t2 - v1_t2);
    }
}

generated quantities {
  // test-retest correlations
  corr_matrix[2] R_rewSens;
  corr_matrix[2] R_effSens;

  // posterior predictions and log-likelihoods
  int y_rep_t1[nPpts, nTrials_max];
  int y_rep_t2[nPpts, nTrials_max];
  int y_rep[nPpts, nTrials_max*2];
  real log_lik_t1[nPpts, nTrials_max];
  real log_lik_t2[nPpts, nTrials_max];
  real sum_log_lik[nPpts];

	// reconstruct correlation matrix from cholesky factors
  R_effSens = R_chol_effSens * R_chol_effSens';
  R_rewSens = R_chol_rewSens * R_chol_rewSens';

  // generate posterior predictions and get likelihood
  for ( p in 1:nPpts ) {
    // define vectors of choice options at time 1 and time 2
    vector[nT_ppts[p,1]] v1_t1;
    vector[nT_ppts[p,1]] v2_t1;
    vector[nT_ppts[p,2]] v1_t2;
    vector[nT_ppts[p,2]] v2_t2;
    
    // vectorized likelihood for time 1
    v1_t1  = rewSens[p,1] * to_vector(rew1[p,1,:]) - effSens[p,1] * to_vector(eff1[p,1,:]);
    v2_t1  = rewSens[p,1] * to_vector(rew2[p,1,:]) - effSens[p,1] * to_vector(eff2[p,1,:]);
    y_rep_t1[p] = bernoulli_rng(inv_logit(v2_t1 - v1_t1));
    //log_lik_t1[p] = bernoulli_logit_lpmf( choice01[p,1,:] | (v2_t1 - v1_t1) );
    
    // vectorized likelihood for time 2
    v1_t2  = rewSens[p,2] * to_vector(rew1[p,2,:]) - effSens[p,2] * to_vector(eff1[p,2,:]);
    v2_t2  = rewSens[p,2] * to_vector(rew2[p,2,:]) - effSens[p,2] * to_vector(eff2[p,2,:]);
    y_rep_t2[p] = bernoulli_rng(inv_logit(v2_t2 - v1_t2));
    //log_lik_t2[p] = bernoulli_logit_lpmf( choice01[p,2,:] | (v2_t2 - v1_t2) );
    
    // unvectorised likelihood as can't get to work otherwise
    for ( t in 1:nTrials_max ) {
     log_lik_t1[p,t] = bernoulli_logit_lpmf( choice01[p,1,t] | (v2_t1[t] - v1_t1[t]) );
     log_lik_t2[p,t] = bernoulli_logit_lpmf( choice01[p,2,t] | (v2_t2[t] - v1_t2[t]) );
    }
    
    // overall
    y_rep[p,1:nTrials_max] = y_rep_t1[p];
    y_rep[p,nTrials_max+1:nTrials_max*2] = y_rep_t2[p];
    sum_log_lik[p] = sum(log_lik_t1[p]) + sum(log_lik_t2[p]);
    }
}

