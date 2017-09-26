using System;
using System.Collections.Generic;
using System.Text;
using Firefly.Box;
using ENV;
using ENV.Web;

namespace WebDemo.Controllers
{
    class OrdersViewModel : ViewModelHelper
    {
        public readonly Northwind.Models.Orders Orders = new Northwind.Models.Orders();
        public readonly Northwind.Models.Customers Customers = new Northwind.Models.Customers();


        public OrdersViewModel()
        {
            From = Orders;
            AllowUpdate = true;
            Where.Add(Orders.OrderDate.IsGreaterOrEqualTo(1997, 1, 1));

            Relations.Add(Customers, Customers.CustomerID.IsEqualTo(Orders.CustomerID));
        }
        protected override void OnSavingRow()
        {
            if (Orders.ShipVia == 0)
                ModelState.AddError(Orders.ShipVia, "Required");
                
        }
    }
}
