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
            ViewModelHelper.Register("Products",typeof(Northwind.Models.Products),true);
            ViewModelHelper.Register("Categories",()=>new CategoriesViewModel());
            ViewModelHelper.Register("OrderDetails", typeof(Northwind.Models.Order_Details), true);
        }
        // GET: DataApi
        public void Index(string name, string id = null)
        {
            ViewModelHelper.ProcessRequest(name, id);
        }
    }
}