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
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            ENV.Common.SuppressDialogs();
            ConnectionManager.UseConnectionPool = true;
            
            //sets the current directory to the bin directory in the parent directory
            System.Environment.CurrentDirectory = 
               Path.Combine(
                Path.GetDirectoryName( HttpContext.Current.Server.MapPath("")),"bin");
            
            //calls a refactored version of the program main of Northwind
            Northwind.Program.Init(new string[0]);

            //connection to sql server without a user and password requires giving permission to the iis user
            //Instead I use an sql server password for this demo
            ConnectionManager.SetDefaultUserAndPassword("sa", "MASTERKEY");
            
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
