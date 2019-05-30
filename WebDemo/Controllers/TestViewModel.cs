using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebDemo.Controllers
{
    public class TestViewModel:ENV.Web.ViewModel
    {
        Northwind.Models.Products Products = new Northwind.Models.Products();
        Northwind.Models.Categories Categories = new Northwind.Models.Categories();
        public TestViewModel()
        {
            From = Products;
            AllowRead = false;
            Relations.Add(Categories, Categories.CategoryID.IsEqualTo(Products.CategoryID));
            AllowUpdate = true;
            MapColumn(Products.ProductID,
                Products.ProductName,
                Products.CategoryID,
                Categories.CategoryName);
            DenyUpdate(Products.CategoryID);
            
        }
    }
}