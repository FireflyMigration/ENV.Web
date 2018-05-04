using System;
using ENV.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ENV.Web.Tests
{
    [TestClass]
    public class TestApiNames
    {
        [TestMethod]
        public void TestBasedOnEntity()
        {
            var d = new DataApi();
            d.Register(typeof(MyTable));
            d.TestApinameExists("mytable", true);
            d.TestApinameExists("myTable", true);
        }
        [TestMethod]
        public void TestBasedViewModel()
        {
            var d = new DataApi();
            d.Register(typeof(MyTableViewModel));
            d.TestApinameExists("MyTable", true);
            d.TestApinameExists("myTable", true);
        }
    }

    class MyTable : Entity
    {
        public MyTable() : base("x", "X", null) { }
    }
    class MyTableViewModel : ViewModel {

    }
}
