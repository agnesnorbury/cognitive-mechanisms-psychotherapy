
data {
  int<lower=1> nPpts;                       // number of participants
  int<lower=1> nItems;                      // number of items per participant
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
  // participant-level latent trait parameters
  real theta[nPpts];                       // latent trait score (e.g., ability)
    
  // item-level difficulty parameters
  vector[nItems] mu;                       // first diffulty for each item
  vector<lower=0>[sum(m)-nItems] delta;    // between-step changes in difficulty for this item
  
  // item-level discriminability paramter
  real<lower=0> alpha[nItems];             // item discriminability 
}

transformed parameters {
  // composite item-level difficulties
  vector[sum(m)] kappa;
  
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
  // priors on latent factors
  theta ~ normal(0,1);            // individual values
  //mu_theta ~ cauchy(0, 5);      // group level mean
  
  // prior on disciminability of each items
  alpha ~ lognormal(1, 1);
  
  // priors on difficulty parameters 
  mu ~ normal(0,5);               // first category difficulty for each item
  delta ~ normal(0,5);            // subseqeunt category incrememental difficulties for each item
  
  // observation model
  for (n in 1:N) {
    r[n] ~ ordered_logistic(theta[jj[n]] * alpha[ii[n]], segment(kappa, pos_kappa[ii[n]], m[ii[n]]));
  }

}

generated quantities {
}
