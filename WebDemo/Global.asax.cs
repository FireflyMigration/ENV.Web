using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using ENV.Data.DataProvider;
using System.IO;

namespace WebDemo
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            //commented out for performance - it uses reflection to read everything - just expensive.
            //   AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            ENV.Common.SuppressDialogs();
            ConnectionManager.UseConnectionPool = true;
            
            //sets the current directory to the bin directory in the parent directory
            Environment.CurrentDirectory = 
               Path.Combine(
                Path.GetDirectoryName( HttpContext.Current.Server.MapPath("")),"bin");
            //determines where the appliaction dlls are
            ENV.AbstractFactory.AlternativeDllPath = Environment.CurrentDirectory;
             
            // Call the init of the original application to load it's ini and other settings
            Northwind.Program.Init(new string[0]);

            //ApplicationStartup=B && DeploymentMode=B
            ENV.UserSettings.DoNotDisplayUI = true;

            //connection to sql server without a user and password requires giving permission to the iis user
            //Instead I use an sql server password for this demo
            // Add this row when you move to a regular IIS, as IIS Express allows anonimous authentication
            // ConnectionManager.SetDefaultUserAndPassword("sa", "MASTERKEY");
            
            // so that btrieve tables will have a primary key we can use.
            BtrieveEntity.UseBtrievePosition = true;
            
            Controllers.ProfilerController.Init();
            


        }
        [ThreadStatic]
        static IDisposable _profilerContext;
        protected void Application_BeginRequest(object sender, System.EventArgs e)
        {
            Firefly.Box.Context.Current.SetNonUIThread();
            _profilerContext =  ENV.Utilities.Profiler.StartContextAndSaveOnEnd(() => ENV.ProgramCollection.CollectRequestPArametersForProfiler(), () =>  VirtualPathUtility.MakeRelative("~", Request.Url.AbsolutePath).Replace("/","_") + "_" + Firefly.Box.Date.Now.ToString("YYYYMMDD") + "_" + ENV.UserMethods.Instance.mTime().ToString());

        }
        protected void Application_EndRequest(object sender, System.EventArgs e)
        {
            if (_profilerContext != null)
            {
                _profilerContext.Dispose();
                _profilerContext = null;
            }
            Firefly.Box.Context.Current.Dispose();
        }
    }
}
