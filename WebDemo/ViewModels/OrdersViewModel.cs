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
    }
}
