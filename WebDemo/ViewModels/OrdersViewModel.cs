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
        Northwind.Models.Orders Orders = new Northwind.Models.Orders();

        public OrdersViewModel()
        {
            From = Orders;
            AllowInsertUpdateDelete();
            OrderBy.Add(Orders.OrderID, SortDirection.Descending);
        }
        protected override void OnSavingRow()
        {
            if (Activity == Activities.Insert)
                Orders.OrderID.Value = Orders.Max(Orders.OrderID)+1;
        }

    }
}
