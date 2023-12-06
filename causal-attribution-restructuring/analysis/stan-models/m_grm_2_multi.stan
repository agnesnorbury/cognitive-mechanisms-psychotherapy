
data {
  int<lower=1> nPpts;                       // number of participants
  int<lower=1> nTraits;                     // number of latent traits to estimate per participant
  int<lower=1> nItems;                      // number of items per participant
  int<lower=1> nItemsA;                     // number of items per participant for trait 1
  int<lower=1> N;                           // total number of observations
  int<lower=1, upper=nPpts>  jj[N];         // person id for observation n
  int<lower=1, upper=nItems> ii[N];         // item id for observation n
  int<lower=0> y[N];                        // response for observations n; y in {0 ... m_i}
}

transformed data {
  // code to cope with variable number of categories across items
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
  // // group-level latent trait parameters
  // vector[nTraits] mu_thetas;               // group-level parameter means
  // vector<lower=0>[nTraits] sigma_thetas;   // group-level parameter sigmas (must be positive)
  
  // participant-level latent trait parameters (raw/untransformed)
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
  // // participant-level latent trait parameters (transformed)
  // real theta_a[nPpts];                     // latent trait score A
  // real theta_n[nPpts];                     // latent trait score B
  
  // composite item-level difficulties
  vector[sum(m)] kappa;
  
  // // loop over participants (non-centered reparameterisation)  
  // for (p in 1:nPpts) {
  //   theta_a[p] = (mu_thetas[1] + sigma_thetas[1] * theta_a_raw[p]);    // implies theta ~ normal(mu_theta, sigma_theta)
  //   theta_n[p] = (mu_thetas[2] + sigma_thetas[2] * theta_n_raw[p]);    // implies theta ~ normal(mu_theta, sigma_theta)
  // }
  
  // loop over items 
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
  // // priors on group-level parameters
  // mu_thetas ~ normal(0,1);
  // sigma_thetas ~ normal(0,1);
  
  // priors on individual-level latent factors
  theta_a ~ normal(0,1);          // individual values
  theta_n ~ normal(0,1);          // individual values
  
  // prior on disciminability of each items
  alpha_a ~ lognormal(1, 1);
  alpha_n ~ lognormal(1, 1);
  
  // priors on difficulty parameters 
  mu ~ normal(0,5);               // first category difficulty for each item
  delta ~ normal(0,5);            // subsequent category incrememental difficulties for each item
  
  // likelihood
  for ( n in 1:N ) {
    if ( ii[n] <= nItemsA ) {
      r[n] ~ ordered_logistic(theta_a[jj[n]] * alpha_a[ii[n]], segment(kappa, pos_kappa[ii[n]], m[ii[n]]));
    } else {
      r[n] ~ ordered_logistic(theta_n[jj[n]] * alpha_n[ii[n]-nItemsA], segment(kappa, pos_kappa[ii[n]], m[ii[n]]));
    }
  }

}

generated quantities {
}
