using ENV.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Firefly.Box;
using ENV;

namespace WebDemo.Controllers
{
    public class CategoriesViewModel : ViewModelHelper
    {
        Northwind.Models.Categories Categories = new Northwind.Models.Categories();
        public CategoriesViewModel()
        {
            From = Categories;
            AllowInsertUpdateDelete();

        }
        protected override void OnSavingRow()
        {
            ModelState.Validate(Categories.Description, v => !Text.IsNullOrEmpty(v), "Please enter a value");

            if (Activity == Activities.Insert)
                Categories.CategoryID.Value = Categories.Max(Categories.CategoryID)+1;
        }
    }
}