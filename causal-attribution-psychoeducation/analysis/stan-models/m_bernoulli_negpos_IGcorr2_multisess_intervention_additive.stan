
data {
  int nTimes;                                // number of time points (sessions)
  int nPpts;                                 // number of participants
  int nTrials_max;                           // maximum number of trials per participant per session
  int nT_ppts[nPpts, nTimes];                // actual number of trials per participant per session
  int<lower=0, upper=1> condition[nPpts];                            // intervention condition for each participant
  int<lower=0, upper=1> internal_neg[nPpts, nTimes, nTrials_max];    // responses for each participant per session 
  int<lower=0, upper=1> internal_pos[nPpts, nTimes, nTrials_max];    // responses for each participant per session 
  int<lower=0, upper=1> global_neg[nPpts, nTimes, nTrials_max];      // responses for each participant per session 
  int<lower=0, upper=1> global_pos[nPpts, nTimes, nTrials_max];      // responses for each participant per session 
}

parameters {
  // group-level correlation matrix (cholesky factor for faster computation)
  // across timepoints and two parameters
  cholesky_factor_corr[4] R_chol_theta_neg; 
  cholesky_factor_corr[4] R_chol_theta_pos; 
  
  // group-level parameters
  // means for each parameter and timepoint
  vector[nTimes] mu_internal_theta_neg;
  vector[nTimes] mu_internal_theta_pos;
  vector[nTimes] mu_global_theta_neg;
  vector[nTimes] mu_global_theta_pos;
  
  // sds for each parameter and timepoint
  vector<lower=0>[4] pars_sigma_neg; 
  vector<lower=0>[4] pars_sigma_pos; 
  
  // individual-level parameters (raw/untransformed values)
  matrix[4,nPpts] pars_pr_neg; 
  matrix[4,nPpts] pars_pr_pos; 
  
  // group-level effects of active intervention at t2 (group level)
  real theta_int_internal_neg;
  real theta_int_internal_pos;
  real theta_int_global_neg;
  real theta_int_global_pos;
}

transformed parameters {
  // individual-level parameter off-sets (for non-centered parameterization)
  matrix[4,nPpts] pars_tilde_neg;
  matrix[4,nPpts] pars_tilde_pos;
  
  // individual-level parameters (transformed values)
  matrix[nPpts,2] theta_internal_neg;
  matrix[nPpts,2] theta_internal_pos;
  matrix[nPpts,2] theta_global_neg;
  matrix[nPpts,2] theta_global_pos;
  
  // construct individual offsets (for non-centered parameterization)
  // with potential correlation for parameters across timepoints
  // and potential correlation between internal-global parameter estimates
  pars_tilde_neg = diag_pre_multiply(pars_sigma_neg, R_chol_theta_neg) * pars_pr_neg;
  pars_tilde_pos = diag_pre_multiply(pars_sigma_pos, R_chol_theta_pos) * pars_pr_pos;
  
  // compute individual-level parameters from non-centered parameterization
  for ( p in 1:nPpts ) {
    // negative events at time 1
    theta_internal_neg[p,1] = mu_internal_theta_neg[1] + pars_tilde_neg[1,p];
    theta_global_neg[p,1]   = mu_global_theta_neg[1]   + pars_tilde_neg[2,p];
    // negative events time 2
    if ( condition[p] == 1 ) {
      // for active intervention participants
      theta_internal_neg[p,2] = mu_internal_theta_neg[2] + pars_tilde_neg[3,p] + theta_int_internal_neg;
      theta_global_neg[p,2]   = mu_global_theta_neg[2]   + pars_tilde_neg[4,p] + theta_int_global_neg;
    } else {
      // for control intervention participants
      theta_internal_neg[p,2] = mu_internal_theta_neg[2] + pars_tilde_neg[3,p];
      theta_global_neg[p,2]   = mu_global_theta_neg[2]   + pars_tilde_neg[4,p];
    }
    
    // positive events at time 1
    theta_internal_pos[p,1] = mu_internal_theta_pos[1] + pars_tilde_pos[1,p];
    theta_global_pos[p,1]   = mu_global_theta_pos[1]   + pars_tilde_pos[2,p];
    // positive events at time 2
    if ( condition[p] == 1 ) {
      // for active intervention participants
      theta_internal_pos[p,2] = mu_internal_theta_pos[2] + pars_tilde_pos[3,p] + theta_int_internal_pos;
      theta_global_pos[p,2]   = mu_global_theta_pos[2]   + pars_tilde_pos[4,p] + theta_int_global_pos;
    } else {
      // for control intervention participants
      theta_internal_pos[p,2] = mu_internal_theta_pos[2] + pars_tilde_pos[3,p];
      theta_global_pos[p,2]   = mu_global_theta_pos[2]   + pars_tilde_pos[4,p];
    }
  }
}

model {
  // uniform [0,1] priors on cholesky factor of correlation matrix
  R_chol_theta_neg ~ lkj_corr_cholesky(1);
  R_chol_theta_pos ~ lkj_corr_cholesky(1);
  
  // define priors on distribution of group-level parameters
  // means
  mu_internal_theta_neg ~ normal(0,1);
  mu_internal_theta_pos ~ normal(0,1);
  mu_global_theta_neg   ~ normal(0,1);
  mu_global_theta_pos   ~ normal(0,1);
  
  // define priors on individual participant deviations from group parameter values
  to_vector(pars_pr_neg) ~ normal(0,1);
  to_vector(pars_pr_pos) ~ normal(0,1);
  
  // priors on group-level effects of active intervention on theta values at t2
  theta_int_internal_neg ~ normal(0,1);
  theta_int_internal_pos ~ normal(0,1);
  theta_int_global_neg   ~ normal(0,1);
  theta_int_global_pos   ~ normal(0,1);

  // loop over observations
  for ( p in 1:nPpts ) {
    // t1
    internal_neg[p,1,:] ~ bernoulli_logit(theta_internal_neg[p,1]);
    internal_pos[p,1,:] ~ bernoulli_logit(theta_internal_pos[p,1]);
    global_neg[p,1,:] ~ bernoulli_logit(theta_global_neg[p,1]);
    global_pos[p,1,:] ~ bernoulli_logit(theta_global_pos[p,1]);
    // t2
    internal_neg[p,2,:] ~ bernoulli_logit(theta_internal_neg[p,2]);
    internal_pos[p,2,:] ~ bernoulli_logit(theta_internal_pos[p,2]);
    global_neg[p,2,:] ~ bernoulli_logit(theta_global_neg[p,2]);
    global_pos[p,2,:] ~ bernoulli_logit(theta_global_pos[p,2]);
  }
}

generated quantities {
  // test-retest correlations
  corr_matrix[4] R_theta_neg;
  corr_matrix[4] R_theta_pos;
  
  // success probability estimates for each individual
  matrix[nPpts, nTimes] p_internal_neg;
  matrix[nPpts, nTimes] p_internal_pos;
  matrix[nPpts, nTimes] p_global_neg;
  matrix[nPpts, nTimes] p_global_pos;
  
  // replicated data
  int internal_neg_rep[nPpts, nTimes, nTrials_max];
  int internal_pos_rep[nPpts, nTimes, nTrials_max];
  int global_neg_rep[nPpts, nTimes, nTrials_max];
  int global_pos_rep[nPpts, nTimes, nTrials_max];
  
  // log likelihoods
  real log_lik_internal_neg[nPpts, nTimes, nTrials_max];
  real log_lik_internal_pos[nPpts, nTimes, nTrials_max];
  real log_lik_global_neg[nPpts, nTimes, nTrials_max];
  real log_lik_global_pos[nPpts, nTimes, nTrials_max];
  real sum_log_lik_in[nPpts];
  real sum_log_lik_ip[nPpts];
  real sum_log_lik_gn[nPpts];
  real sum_log_lik_gp[nPpts];
 
	// reconstruct correlation matrix from cholesky factors
  R_theta_neg = R_chol_theta_neg * R_chol_theta_neg';
  R_theta_pos = R_chol_theta_pos * R_chol_theta_pos';
  
  // sucess probabilities for participants and sessions
  p_internal_neg = inv_logit(theta_internal_neg);
  p_internal_pos = inv_logit(theta_internal_pos);
  p_global_neg = inv_logit(theta_global_neg);
  p_global_pos = inv_logit(theta_global_pos);

  // generate posterior predictions
  for (p in 1:nPpts) {
    // unvectorised as can't get to work otherwise :-(
    for ( t in 1:nTrials_max ) {
      // t1
      internal_neg_rep[p,1,t] = bernoulli_rng(inv_logit(theta_internal_neg[p,1]));
      internal_pos_rep[p,1,t] = bernoulli_rng(inv_logit(theta_internal_pos[p,1]));
      global_neg_rep[p,1,t]   = bernoulli_rng(inv_logit(theta_global_neg[p,1]));
      global_pos_rep[p,1,t]   = bernoulli_rng(inv_logit(theta_global_pos[p,1]));
      // t2
      internal_neg_rep[p,2,t] = bernoulli_rng(inv_logit(theta_internal_neg[p,2]));
      internal_pos_rep[p,2,t] = bernoulli_rng(inv_logit(theta_internal_pos[p,2]));
      global_neg_rep[p,2,t]   = bernoulli_rng(inv_logit(theta_global_neg[p,2]));
      global_pos_rep[p,2,t]   = bernoulli_rng(inv_logit(theta_global_pos[p,2]));  
      // t1
      log_lik_internal_neg[p,1,t] = bernoulli_logit_lpmf( internal_neg[p,1,t] | theta_internal_neg[p,1] );
      log_lik_internal_pos[p,1,t] = bernoulli_logit_lpmf( internal_pos[p,1,t] | theta_internal_pos[p,1] );
      log_lik_global_neg[p,1,t]   = bernoulli_logit_lpmf( global_neg[p,1,t]   | theta_global_neg[p,1] );
      log_lik_global_pos[p,1,t]   = bernoulli_logit_lpmf( global_pos[p,1,t]   | theta_global_pos[p,1] );
      // t2
      log_lik_internal_neg[p,2,t] = bernoulli_logit_lpmf( internal_neg[p,2,t] | theta_internal_neg[p,2] );
      log_lik_internal_pos[p,2,t] = bernoulli_logit_lpmf( internal_pos[p,2,t] | theta_internal_pos[p,2] );
      log_lik_global_neg[p,2,t]   = bernoulli_logit_lpmf( global_neg[p,2,t]   | theta_global_neg[p,2] );
      log_lik_global_pos[p,2,t]   = bernoulli_logit_lpmf( global_pos[p,2,t]   | theta_global_pos[p,2] );
    }
    
    sum_log_lik_in[p] = sum(log_lik_internal_neg[p,1]) + sum(log_lik_internal_neg[p,2]);
    sum_log_lik_ip[p] = sum(log_lik_internal_pos[p,1]) + sum(log_lik_internal_pos[p,2]);
    sum_log_lik_gn[p] = sum(log_lik_global_neg[p,1]) + sum(log_lik_global_neg[p,2]);
    sum_log_lik_gp[p] = sum(log_lik_global_pos[p,1]) + sum(log_lik_global_pos[p,2]);
    
  }
  
}

