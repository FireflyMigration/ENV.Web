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
            _dataApi.Register(typeof(Northwind.Models.Categories),true);
            _dataApi.Register("OrderDetails",typeof(Northwind.Models.Order_Details),true);
            _dataApi.Register(typeof(Northwind.Models.Products));
            _dataApi.Register(typeof(ViewModels.OrdersViewModel));
            _dataApi.Register(typeof(Northwind.Models.Customers));
            _dataApi.Register(typeof(Northwind.Models.Shippers));
            
        }
        // GET: DataApi
        public void Index(string name, string id = null)
        {
            _dataApi.ProcessRequest(name, id);
        }
    }
}