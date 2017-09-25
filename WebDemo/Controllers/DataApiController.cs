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
            _dataApi.Register("Products",typeof(Northwind.Models.Products),true);
            _dataApi.Register("Categories",()=>new CategoriesViewModel());
            _dataApi.Register("OrderDetails", typeof(Northwind.Models.Order_Details), true);
        }
        // GET: DataApi
        public void Index(string name, string id = null)
        {
            _dataApi.ProcessRequest(name, id);
        }
    }
}