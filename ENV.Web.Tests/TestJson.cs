using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Firefly.Box.Testing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ENV.Web.Tests
{
    [TestClass]
    public class TestJson
    {

        [TestMethod]
        public void Test1()
        {
            var original = (DataItem)new JsonParser().FromJson(json1);
            var parsed = DataItem.FromJson(json1);
            parsed.ToJson().ShouldBe(original.ToJson());
        }

        [TestMethod]
        public void Test2()
        {
            var parsed = DataItem.FromJson(json);
            parsed.Get("mail").ToString().ShouldBe("office@blabla.co.il");
        }

        [TestMethod]
        public void Test3()
        {
            var original = (DataList)new JsonParser().FromJson(json2);
            var parsed = DataList.FromJson(json2);

            parsed.ToJson().ShouldBe(original.ToJson());
        }

        const string json1 = @"{
    ""id"": 754,
    ""mspr"": 64545,
    ""kod1"": 2004564373,
    ""kod2"": 122032622}";

        const string json = @"{
    ""startTime"": ""10:45:19"",
    ""date"": ""2018-06-13"",
    ""price"": 425.88,
    ""notes"": """",
    ""phone"": ""03-123456"",    
    ""sum"": 118506.74,
    ""chshbonitBdoal"": false,
    ""mail"": ""office@blabla.co.il"",    
    ""name"": ""דגכ 111 בע\""מ""
}";

        const string json2 = @"[
    {
        ""id"": 1,
        ""categoryName"": ""Beverages"",
        ""description"": ""Soft drink""
    },
    {
        ""id"": 2,
        ""categoryName"": ""Condiments"",
        ""description"": ""Sweet and""
    },
    {
        ""id"": 3,
        ""categoryName"": ""Confections"",
        ""description"": ""Desserts,""
    },
    {
        ""id"": 4,
        ""categoryName"": ""Dairy Products"",
        ""description"": ""Cheeses""
    },
    {
        ""id"": 5,
        ""categoryName"": ""Grains/Cereals"",
        ""description"": ""Breads, cr""
    },
    {
        ""id"": 6,
        ""categoryName"": ""Meat/Poultry"",
        ""description"": ""Prepared m""
    },
    {
        ""id"": 7,
        ""categoryName"": ""Produce"",
        ""description"": ""Dried frui""
    },
    {
        ""id"": 8,
        ""categoryName"": ""Seafood"",
        ""description"": ""Seaweed an""
    }
]";



    }
}
