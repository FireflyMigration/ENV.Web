using ENV.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebDemo.Controllers
{
    public class PostDataApiController : Controller
    {
        static DataApi _dataApi = new DataApi()
        {
            PostOnly = true,
            HttpMethodParamName = "method"
        };
        static PostDataApiController()
        {

            _dataApi.Register(typeof(Northwind.Models.Categories), true);

        }
        // GET: DataApi
        public void Index(string dataApiRegisteredName, string id = null)
        {
            _dataApi.ProcessRequest(dataApiRegisteredName, id);
        }
    }
}