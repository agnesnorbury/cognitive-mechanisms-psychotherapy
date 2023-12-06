
data {
  // overall data
  int nTimes;                                // number of time points (sessions)
  int nPpts;                                 // number of participants
  
  // causal-attribution task data
  int nTrials_max;                           // maximum number of trials per participant per session
  int nT_ppts[nPpts, nTimes];                // actual number of trials per participant per session
  int<lower=0, upper=1> condition[nPpts];                            // intervention condition for each participant
  int<lower=0, upper=1> internal_neg[nPpts, nTimes, nTrials_max];    // responses for each participant per session 
  int<lower=0, upper=1> internal_pos[nPpts, nTimes, nTrials_max];    // responses for each participant per session 
  int<lower=0, upper=1> global_neg[nPpts, nTimes, nTrials_max];      // responses for each participant per session 
  int<lower=0, upper=1> global_pos[nPpts, nTimes, nTrials_max];      // responses for each participant per session
  
  // self-report data
  int<lower=1> nItems;                      // number of items per participant
  int<lower=1> nTraits;                      // number of latent traits to estimate per participant
  int<lower=1> nItemsA;                      // number of items per participant
  int<lower=1> N;                           // total number of observations
  int<lower=1, upper=nPpts>  jj[N];         // person id for observation n
  int<lower=1, upper=nItems> ii[N];         // item id for observation n
  int<lower=0> y[N];                        // response for observations n; y in {0 ... m_i}
}

transformed data {
  // for self-report data - code to cope with variable number of categories across items
  int r[N];                           // modified response; r = 1, 2, ... m_i + 1
  int m[nItems];                      // difficulty parameters per item
  int pos_kappa[nItems];              // first position in kappa vector for item
  int pos_delta[nItems];              // first position in delta vector for item
 
  // define array across items 
  m = rep_array(0, nItems);
  for ( n in 1:N ) {
    r[n] =  y[n] + 1;                 // categorical data needs to be > 0
    if (y[n] > m[ii[n]]) {
      m[ii[n]] =  y[n];
    }
  }
  
  // initialise position arrays
  pos_kappa[1] = 1;
  pos_delta[1] = 1;
  
  // iterate across rest of items
  for( i in 2:nItems ) {
    pos_kappa[i] = pos_kappa[i-1] + m[i-1];
    pos_delta[i] = pos_delta[i-1] + m[i-1] - 1;
  }
}

parameters {
  //////////////causal-attribution task parameters ////////////////
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
  
  // group-level beta weights for effect of GRM latent factors on baseline and intervention
  real beta_b1;
  real beta_b2;
  // real beta_b3;
  // real beta_b4;
  real beta_int1;
  real beta_int2;
  
  ///////////////////self-report GRM parameters//////////////////////////
  // participant-level latent trait parameters
  real theta_a[nPpts];                 // latent trait score A
  real theta_n[nPpts];                 // latent trait score B
    
  // item-level difficulty parameters
  vector[nItems] mu;                       // first diffulty for each item
  vector<lower=0>[sum(m)-nItems] delta;    // between-step changes in difficulty for this item
  
  // item-level discriminability paramter
  real<lower=0> alpha_a[nItemsA];          // item discriminability for trait A
  real<lower=0> alpha_n[nItems - nItemsA]; // item discriminability for trait B

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
  
  // composite item-level difficulties for grm model
  vector[sum(m)] kappa;
  
  // construct individual offsets (for non-centered parameterization)
  // with potential correlation for parameters across timepoints
  // and potential correlation between internal-global parameter estimates
  pars_tilde_neg = diag_pre_multiply(pars_sigma_neg, R_chol_theta_neg) * pars_pr_neg;
  pars_tilde_pos = diag_pre_multiply(pars_sigma_pos, R_chol_theta_pos) * pars_pr_pos;
  
  //////////////causal-attribution task parameters ////////////////
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
    theta_internal_pos[p,1] = mu_internal_theta_pos[1] + pars_tilde_pos[1,p] + beta_b1*theta_a[p] + beta_b2*theta_n[p];
    theta_global_pos[p,1]   = mu_global_theta_pos[1]   + pars_tilde_pos[2,p];
    // positive events at time 2
    if ( condition[p] == 1 ) {
      // for active intervention participants
      theta_internal_pos[p,2] = mu_internal_theta_pos[2] + pars_tilde_pos[3,p] + theta_int_internal_pos + 
                                beta_int1*theta_a[p] + beta_int2*theta_n[p];
      theta_global_pos[p,2]   = mu_global_theta_pos[2]   + pars_tilde_pos[4,p] + theta_int_global_pos;
    } else {
      // for control intervention participants
      theta_internal_pos[p,2] = mu_internal_theta_pos[2] + pars_tilde_pos[3,p];
      theta_global_pos[p,2]   = mu_global_theta_pos[2]   + pars_tilde_pos[4,p];
    }
  }
  
  ///////////////////////grm parameters/////////////////////////
  // assign item-level difficulty parameters, dependending on n cateogires (k)
  for ( i in 1:nItems ) {
    if (m[i] > 0) {
      // if first category, define difficulty as mu
      kappa[pos_kappa[i]] = mu[i];
    }
    for (k in 2:m[i]) {
      // if not, incremebent difficulty based on category number (position) & delta value
      kappa[pos_kappa[i]+k-1] = kappa[pos_kappa[i]+k-2] + delta[pos_delta[i]+k-2];
    }
  }
}

model {
  ////////////////////causal-attribution task priors//////////////////
  // uniform [0,1] priors on cholesky factor of correlation matrix
  R_chol_theta_neg ~ lkj_corr_cholesky(1);
  R_chol_theta_pos ~ lkj_corr_cholesky(1);
  
  // define priors on distribution of group-level parameters
  // means
  mu_internal_theta_neg ~ normal(0,1);
  mu_internal_theta_pos ~ normal(0,1);
  mu_global_theta_neg   ~ normal(0,1);
  mu_global_theta_pos   ~ normal(0,1);
    
  // priors on group-level effects of active intervention on theta values at t2
  theta_int_internal_neg ~ normal(0,1);
  theta_int_internal_pos ~ normal(0,1);
  theta_int_global_neg   ~ normal(0,1);
  theta_int_global_pos   ~ normal(0,1);
  
  // define priors on individual participant deviations from group parameter values
  to_vector(pars_pr_neg) ~ normal(0,1);
  to_vector(pars_pr_pos) ~ normal(0,1);
  
  // group-level beta weight on moderators of intervention effecs
  beta_b1 ~ normal(0,1);
  beta_b2 ~ normal(0,1);
  // beta_b3 ~ normal(0,1);
  // beta_b4 ~ normal(0,1);
  beta_int1 ~ normal(0,1);
  beta_int2 ~ normal(0,1);
  
  ///////////////////grm priors/////////////////////////////////////
  // priors on disciminability of each items
  alpha_a ~ lognormal(1,1);
  alpha_n ~ lognormal(1,1);
  
  // priors on traits
  theta_a ~ normal(0,1);          
  theta_n ~ normal(0,1);          
  
  // priors on difficulty parameters 
  mu ~ normal(0,5);               // first category difficulty for each item
  delta ~ normal(0,5);            // subseqeunt category incrememental difficulties for each item
  
  
  ////////////////model for causal-attribution task data/////////////
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
  
  //////////////grm for self-report data//////////////////////////////
  // loop over observations
  // loop over observations
  for ( n in 1:N ) {
    if ( ii[n] <= nItemsA ) {
      r[n] ~ ordered_logistic(theta_a[jj[n]] * alpha_a[ii[n]], segment(kappa, pos_kappa[ii[n]], m[ii[n]]));
    } else {
      r[n] ~ ordered_logistic(theta_n[jj[n]] * alpha_n[ii[n]-nItemsA], segment(kappa, pos_kappa[ii[n]], m[ii[n]]));
    }
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
  
  // // replicated data
  // int<lower=0, upper=1> Y_neg_rep[nPpts, nTimes, nTrials_max];
  // int<lower=0, upper=1> Y_pos_rep[nPpts, nTimes, nTrials_max];

	// reconstruct correlation matrix from cholesky factors
  R_theta_neg = R_chol_theta_neg * R_chol_theta_neg';
  R_theta_pos = R_chol_theta_pos * R_chol_theta_pos';
  
  // sucess probabilities for participants and sessions
  p_internal_neg = inv_logit(theta_internal_neg);
  p_internal_pos = inv_logit(theta_internal_pos);
  p_global_neg = inv_logit(theta_global_neg);
  p_global_pos = inv_logit(theta_global_pos);

  // // generate posterior predictions
  // for (p in 1:nPpts) {
  //   // t1
  //   Y_neg_rep[p,1,:] = bernoulli_rng(inv_logit(theta_neg[p,1]));
  //   Y_pos_rep[p,1,:] = bernoulli_rng(inv_logit(theta_pos[p,1]));
  //   // t2
  //   Y_neg_rep[p,2,:] = bernoulli_rng(inv_logit(theta_neg[p,2]));
  //   Y_pos_rep[p,2,:] = bernoulli_rng(inv_logit(theta_pos[p,2]));
  // }
}

