// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
/*
export const environment = {
  baseUrl: 'https://mac.mactech.net.in/',
  loginbaseUrl: 'https://mac.mactech.net.in/',
  
  loginbaseUrleNach: 'https://unsecurepl.manappuram.com/pl/', 
  login_api: 'plgen/',
  lms_per_gen_api: 'plgen/',
  lms_api: 'lms_API/',
  los_api: 'los_API/',
  waiver_api:'plgen/',
  waiver_kyc:'plapi_public/',
  lms_los_api: 'lms_los_uat/',
  aadhaar_api: 'aadhaarapi/',
  login_api_mafil:'tw/lmspersonalgennew/',
  login_mafil2:'tw/lms_api_public/',
  esign_api:'esign_public/',
  lmspersonalgen_api:'lmspersonalgen/',
  plgen_api:'plgen/',
  apiVersion: 'v1',
  buildVersion: "1.0.44",
  lms_path_tw:"tw/lms_api_public/",
  baseUrltw:"https://unsecurepl.manappuram.com/",
  baseURLKYC: "https://uatonpay.manappuram.com/",
  production: true,
};
export var defaultValues = {
  ProductId: 1,
  FIRM_ID: 1,
  Branch_ID: 1,
  User_ID: "1",
  Role: 1,
  UserName: "user",
};
*/

/// LIVE
// plapi_publiclive
/*
export const environment = {
  baseUrl: 'https://unsecurepl.manappuram.com/',
  loginbaseUrl: 'https://unsecurepl.manappuram.com/', 
  loginbaseUrleNach: 'https://unsecurepl.manappuram.com/pl/', 
  // lms_per_gen_api: 'plapi_public/',
  // login_api: 'plapi_public/',
  lms_per_gen_api: 'plapi_public/',
  login_api: 'plapi_public/',
  login_api_mafil:'tw/lmspersonalgennew/',
  login_mafil2:'tw/lms_api_public/',
  lms_api: 'lms_API/',
  waiver_api:'plapi_public/',
  waiver_kyc:'plapi_public/',
  // waiver_api:'plapi_public/',
  // waiver_kyc:'plapi_public/',
  los_api: 'los_API/',
  baseURLKYC:"https://unsecurepl.manappuram.com/",
  baseUrltw:"https://unsecurepl.manappuram.com/",
  lms_path_tw:"tw/lms_api_public/",
  lms_los_api: 'lms_los_uat/',
  aadhaar_api: 'aadhaarapi/',
  esign_api:'esign_public/',
  lmspersonalgen_api:'plapi_public/',
  plgen_api:'plapi_public/',
  // lmspersonalgen_api:'plapi_public/',
  // plgen_api:'plapi_public/',
  apiVersion: 'v1',
  buildVersion: "1.0.44",
  production: true,
  // baseUrltw:"https://unsecurepl.manappuram.com/",
  // lms_path_tw:"tw/lms_api_public/",

  // baseUrl: 'https://mac.mactech.net.in/',
  // loginbaseUrl: 'https://mac.mactech.net.in/',
  // login_api: 'plgen/',
  // lms_per_gen_api: 'plgen/',
  session:'plapi_public_new/',

  // lms_api: 'lms_API/',
  // los_api: 'los_API/',
  // lms_los_api: 'lms_los_uat/',
  // aadhaar_api: 'aadhaarapi/',
  // esign_api:'esign_public/',
  // lmspersonalgen_api:'lmspersonalgen/',

  // plgen_api:'plgen/',
  // apiVersion: 'v1',
  // buildVersion: "2.0.0",
  // production: true,
  
};
export var defaultValues = {
  ProductId: 1,
  FIRM_ID: 1,
  Branch_ID: 1,
  User_ID: "1",
  Role: 1,
  UserName: "user",
};
*/

///UAT

export const environment = {
  // basePublic:'https://uatonpay.manappuram.com/',
  baseUrl: 'https://uatvef.manappuram.com/',
  loginbaseUrl: 'https://uatvef.manappuram.com/', 
  loginbaseUrleNach: 'https://uatvef.manappuram.com/', 
  lms_per_gen_api: 'plapi_public/',
  login_api: 'plapi_public/',
  login_api_mafil:'tw/lmspersonalgennew/',
  login_mafil2:'tw/lms_api_public/',
  lms_api: 'lms_API/',
  waiver_api:'plapi_public/',
  los_api: 'los_API/',
  lms_los_api: 'lms_los_uat/',
  aadhaar_api: 'aadhaarapi/',
  esign_api:'esign_public/',
  lmspersonalgen_api:'plapi_public/',
  plgen_api:'plapi_public/',
  apiVersion: 'v1',
  session:'plapi_public/',

  buildVersion: "1.0.44",
  production: true,
  baseUrltw:"https://uatvef.manappuram.com/",
  lms_path_tw:"tw/lms_api_public/",
  baseURLKYC:"https://uatvef.manappuram.com/",
  waiver_kyc:"plapi_public/",
  sp:"QCMkJV4mKg",
  testkey: "sk_test_8Bla4nqOEbyhbjc2rDu4T3yL",

  k: "N3glRCpHLUthUGRTZ1YkQA==",
  k1:"N3ghQSVEKkctS2FQZFNnVg==",
  abdapiKey: (window as any).__env && (window as any).__env.abdapiKey || ''
  // baseUrl: 'https://mac.mactech.net.in/',
  // loginbaseUrl: 'https://mac.mactech.net.in/',
  // login_api: 'plgen/',
  // lms_per_gen_api: 'plgen/',

  // lms_api: 'lms_API/',
  // los_api: 'los_API/',
  // lms_los_api: 'lms_los_uat/',
  // aadhaar_api: 'aadhaarapi/',
  // esign_api:'esign_public/',
  // lmspersonalgen_api:'lmspersonalgen/',

  // plgen_api:'plgen/',
  // apiVersion: 'v1',
  // buildVersion: "2.0.0",
  // production: true,

  
};
export var defaultValues = {
  ProductId: 1,
  FIRM_ID: 1,
  Branch_ID: 1,
  User_ID: "1",
  Role: 1,
  UserName: "user",
};

