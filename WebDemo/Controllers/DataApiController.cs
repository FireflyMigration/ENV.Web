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
        static DataApiHelper _dataApi = new DataApiHelper();
        static DataApiController()
        {
            _dataApi.Register("Categories", typeof(Northwind.Models.Categories));
            _dataApi.Register("Orders", typeof(Northwind.Models.Orders));
            
        }
        // GET: DataApi
        public void Index(string name, string id = null)
        {
            _dataApi.ProcessRequest(name, id);
        }
    }
}