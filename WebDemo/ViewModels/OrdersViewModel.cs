﻿using System;
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

        public OrdersViewModel()
        {
            From = Orders;
            AllowUpdate = true;

            MapColumn(Orders.OrderID,
                Orders.CustomerID,
                Orders.OrderDate,
                Orders.ShipVia);
            MapExperssion("ServerSideDayOfWeek", () => u.NDOW(u.DOW(Orders.OrderDate)));
        }
    }
}
