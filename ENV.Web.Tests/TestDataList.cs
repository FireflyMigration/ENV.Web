using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Firefly.Box.Testing;

namespace ENV.Web.Tests
{
    [TestClass]
    public class TestDataList
    {
        [TestMethod]
        public void TestReadTheString()
        {
            var x = @"{
""id"": 1,
""productName"": ""Chai123"",
""supplierID"": 1,
""categoryID"": 1,
""quantityPerUnit"": ""10 boxes x 20 bags"",
""unitPrice"": 18,
""unitsInStock"": 39,
""unitsOnOrder"": 0,
""reorderLevel"": 10,
""discontinued"": ""False""
}";
            var it = DataItem.FromJson(x);
            it["id"].Number.ShouldBe(1);
        }
        [TestMethod]
        public void TestJsonParse()
        {
            var dl = new DataList();
            var it = dl.AddItem();
            it.Set("firstName", "noam");
            it.Set("lastName", "honig");
            var kids = new DataList();
            var kit = kids.AddItem();
            kit.Set("firstName", "maayan");
            kit = kids.AddItem();
            kit.Set("firstName", "itamar");
            kit = kids.AddItem();
            kit.Set("firstName", "ofri");
            it.Set("kids", kids);

            it = dl.AddItem();
            it.Set("firstName", "yael");
            it.Set("lastName", "Katri Honig");
            var x = dl.ToJson();
            var newDl = DataList.FromJson(x);
            newDl.Count.ShouldBe(2);
            newDl[0].Get("firstName").ShouldBe("noam");
            newDl[0].GetList("kids")[2].Get("firstName").ShouldBe("ofri");

        }
        [TestMethod]
        public void TestBool()
        {
            var di = new DataItem();
            di.Set("x", false);
            di.Set("y", true);
            var x = di.ToJson();
            x.ShouldContain("\"x\":false");
            var z = DataItem.FromJson(x);
            di["x"].Bool.ShouldBe(false);
            di["y"].Bool.ShouldBe(true);
        }
    }
}
