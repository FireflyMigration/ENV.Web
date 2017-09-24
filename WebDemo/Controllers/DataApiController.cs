using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ENV.Web;

namespace WebDemo.Controllers
{
    public class DataApiController : Controller
    {
        static DataApiController()
        {
            ViewModelHelper.RegisterEntity("Products",typeof(Northwind.Models.Products),true);
            ViewModelHelper.RegisterEntity("Categories", typeof(Northwind.Models.Categories),true);
            
        }
        // GET: DataApi
        public void Index(string name, string id = null)
        {
            ViewModelHelper.ProcessRequest(name, id);
        }
    }
}