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
        static DataApi _dataApi = new DataApi();
        static DataApiController()
        {
            
            _dataApi.Register(typeof(Northwind.Models.Categories), true);
            _dataApi.Register(typeof(TestViewModel));

        }
        // GET: DataApi
        public void Index(string dataApiRegisteredName, string id = null)
        {
            _dataApi.ProcessRequest(dataApiRegisteredName, id);
        }
    }
}