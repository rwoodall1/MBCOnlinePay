using System;
using System.Collections.Generic;
using System.Linq;
using Domain;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using Repositories.DBContext;
using Exceptionless;
using System.Web.Http;

namespace Webapp
{
    public partial class Startup
    {
        private static readonly string _loginPath = "/login";
        private static readonly TimeSpan _expirationTimeSpan = TimeSpan.FromDays(1);
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void OnSubmittingEvent(Object sender, EventSubmittingEventArgs e)
        {
            if (!e.IsUnhandledError)
            {
                return;
            }


            // Ignore 404s
            //if (e.Event.IsNotFound()) {
            //    e.Cancel = true;
            //    return;
            //}

            // Get the error object.
            var error = e.Event.GetError();
            if (error == null) { return; }

            // Dont Log any 'TaskCanceledException in ThrowForNonSuccess A task was canceled.' errors. 
            // We think this is being caused by users closing browers or timeouts. Only see it happening to api/order/uploadBase64ProofImage
            if (error.Message == "A task was canceled." && error.Type == "System.Threading.Tasks.TaskCanceledException")
            {
                return;
            }


            // Ignore 401 (Unauthorized) and request validation errors.
            //if (error.Code == "401" || error.Type == "System.Web.HttpRequestValidationException") {
            //    e.Cancel = true;
            //    return;
            //}
        }
        public void ConfigureAuth(IAppBuilder app)
        {   //not user right now filter out some errors
            //ExceptionlessClient.Default.Configuration.SetVersion("v-39/");
            //ExceptionlessClient.Default.SubmittingEvent += OnSubmittingEvent;
            ExceptionlessClient.Default.RegisterWebApi(GlobalConfiguration.Configuration);
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationRoleManager>(ApplicationRoleManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString(_loginPath),
                SlidingExpiration = true,
                ExpireTimeSpan = _expirationTimeSpan,
                CookieSecure = CookieSecureOption.SameAsRequest,
                Provider = new CookieAuthenticationProvider
                {
                    // Enables the application to validate the security stamp when the user logs in.
                    // This is a security feature which is used when you change a password or add an external login to your account.  
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, ApplicationUser>(
                        validateInterval: TimeSpan.FromMinutes(30),
                        regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager, DefaultAuthenticationTypes.ApplicationCookie))
                },

            });

            // Configure the application for OAuth based flow
//            PublicClientId = "self";
//            OAuthOptions = new OAuthAuthorizationServerOptions
//            {
//                TokenEndpointPath = new PathString("/Token"),
//                Provider = new ApplicationOAuthProvider(PublicClientId),
//                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
//                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
//                AllowInsecureHttp = true
//            };
//
//            // Enable the application to use bearer tokens to authenticate users
//            app.UseOAuthBearerTokens(OAuthOptions);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //    consumerKey: "",
            //    consumerSecret: "");

            //app.UseFacebookAuthentication(
            //    appId: "",
            //    appSecret: "");

            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "",
            //    ClientSecret = ""
            //});
        }
    }
}
