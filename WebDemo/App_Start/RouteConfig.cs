using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebDemo
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute("DataApi", "dataApi/{name}/{id}", new { controller = "DataApi", action = "Index",name=UrlParameter.Optional, id = UrlParameter.Optional });
            routes.MapRoute(
                  name: "Default",
                  url: "{controller}/{action}/{id}",
                  defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                  constraints: new { controller = "Home|Profiler" } // My MVC Controllers - otherwise let angular handle it
              );
            routes.MapRoute(
                name: "spa-fallback",
                url: "{*url}",
                defaults: new { controller = "Home", action = "Index" }
            );
        }
    }
}
