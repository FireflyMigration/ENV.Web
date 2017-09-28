using System;
using System.Collections.Generic;
using System.Text;
using Firefly.Box;
using ENV;
using ENV.Web;

namespace WebDemo.ViewModels
{
    class OrdersViewModel : ViewModelHelper
    {
        public readonly Northwind.Models.Orders Orders = new Northwind.Models.Orders();
        public readonly Northwind.Models.Shippers Shippers = new Northwind.Models.Shippers();

        public OrdersViewModel()
        {
            From = Orders;

            Relations.Add(Shippers, Shippers.ShipperID.IsEqualTo(Orders.ShipVia));

            AllowUpdate = true;
            Where.Add(Orders.OrderDate.IsGreaterOrEqualTo(1997, 1, 1));
            Shippers.CompanyName.Caption = "Shipper Name";
            MapColumn(Orders.OrderID,
                Orders.CustomerID,
                Orders.OrderDate,
                Orders.ShipVia,
                Shippers.CompanyName);
            MapExperssion("ServerSideDayOfWeek", () => u.NDOW(u.DOW(Orders.OrderDate)));

            DenyUpdate(Orders.OrderID);
        }
        protected override void OnSavingRow()
        {
            if (Orders.OrderDate.Year < 1995)
                ModelState.AddError(Orders.OrderDate, "invalid date");
            ModelState.Required(Orders.OrderID);
            if (Orders.ShipVia > 9)
                ModelState.AddError(Orders.ShipVia, "Please enter valid ship via");
        }
    }
}
