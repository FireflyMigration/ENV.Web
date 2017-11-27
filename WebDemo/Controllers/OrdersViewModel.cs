using System;
using System.Collections.Generic;
using System.Text;
using Firefly.Box;
using ENV;
using ENV.Web;

namespace WebDemo.Controllers
{
    class OrdersViewModel : ViewModel
    {
        Northwind.Models.Orders Orders = new Northwind.Models.Orders();
        public OrdersViewModel()
        {
            From = Orders;
            AllowInsertUpdateDelete();
        }
        protected override void OnSavingRow()
        {
            ModelState.Required(Orders.CustomerID);
            ModelState.Exists(Orders.CustomerID, new Northwind.Models.Customers().CustomerID);
            if (Activity == Activities.Insert)
                Orders.OrderID.Value = Orders.Max(Orders.OrderID) + 1;
        }
    }
}
