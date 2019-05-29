using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ENV.Web.Tests
{
    /// <summary>
    /// Summary description for TestDataApi
    /// </summary>
    [TestClass]
    public class TestDataApi
    {
        [TestMethod]
        public void TestApi()
        {
            var dapi = new DataApi();
            dapi.Register(typeof(MockTable));
            
        }
    }

   
}
