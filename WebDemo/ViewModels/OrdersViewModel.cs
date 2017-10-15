using System;
using System.Collections.Generic;
using System.Text;
using Firefly.Box;
using ENV;
using ENV.Web;

namespace WebDemo.ViewModels
{
    class OrdersViewModel : ViewModel
    {
        Northwind.Models.Orders Orders = new Northwind.Models.Orders();
        public OrdersViewModel()
        {
            From = Orders;
            AllowUpdate = true;
            AllowInsert = true;
            AllowDelete = true;
        }
        protected override void OnSavingRow()
        {
            if (Activity == Activities.Insert)
                Orders.OrderID.Value = Orders.Max(Orders.OrderID) + 1;
            ModelState.Required(Orders.CustomerID);
            if (Orders.OrderDate.Year < 1990)
                ModelState.AddError(Orders.OrderDate, "Invalid Date");
            ModelState.Exists(Orders.CustomerID, new Northwind.Models.Customers().CustomerID);
            ModelState.Exists(Orders.ShipVia, new Northwind.Models.Shippers().ShipperID);
        }
    }
}
