using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Firefly.Box.Testing;
using Firefly.Box;
using ENV.Data;

namespace ENV.Web.Tests
{
    [TestClass]
    public class TestViewModelHelper
    {
        internal class TestVMHWithMoreThanOneMemoberInThePrimaryKey : ViewModel
        {
            public MockTable mt = new MockTable();
            public TestVMHWithMoreThanOneMemoberInThePrimaryKey()
            {
                From = mt;
                mt.SetPrimaryKey(mt.c, mt.a);
            }
            protected override void OnSavingRow()
            {
                if (Activity== Activities.Insert)
                    mt.a.Value = mt.Max(mt.a) + 1;
            }
            


        }
        [TestMethod]
        public void TestViewModelHelper_BigPrimaryKey()
        {
            var mt = new MockTable();
            mt.Truncate();
            mt.InsertRow(1, 1, "noam");
            mt.InsertRow(2, 2, "yael");
            var vmc = new TestVMHWithMoreThanOneMemoberInThePrimaryKey();
            var dl = vmc.GetRows();
            dl.Count.ShouldBe(2);
            dl[0]["c1"].Number.ShouldBe(1);
            dl[1]["c1"].Number.ShouldBe(2);
            dl[0]["c2"].Number.ShouldBe(1);
            dl[0]["c3"].Text.ShouldBe("noam");

            var item = vmc.GetRow(dl[0]["id"].Text);
            item["c1"].Number.ShouldBe(1);
        }


        internal class TestVMH : ViewModel
        {
            public MockTable mt = new MockTable();
            public TestVMH()
            {
                From = mt;
            }
            protected override void OnSavingRow()
            {
                if (Activity== Activities.Insert)
                    mt.a.Value = mt.Max(mt.a) + 1;
            }


        }
        [TestMethod]
        public void TestViewModelHelper_0()
        {
            var mt = new MockTable();
            mt.Truncate();
            mt.InsertRow(1, 1, "noam");
            mt.InsertRow(2, 2, "yael");
            var vmc = new TestVMH();
            var dl = vmc.GetRows();
            dl.Count.ShouldBe(2);
            dl[0]["id"].Number.ShouldBe(1);
            dl[1]["id"].Number.ShouldBe(2);
            dl[0]["c2"].Number.ShouldBe(1);
            dl[0]["c3"].Text.ShouldBe("noam");
        }
        [TestMethod]
        public void TestViewModelHelper_1()
        {
            var mt = new MockTable();
            mt.Truncate();
            mt.InsertRow(1, 1, "noam");
            mt.InsertRow(2, 2, "yael");
            var vmc = new TestVMH();
            var item = vmc.GetRow("1");

            item["id"].Number.ShouldBe(1);
            item["c2"].Number.ShouldBe(1);
            item["c3"].Text.ShouldBe("noam");
            item.Set("c3", "yoni");
            item = vmc.Update("1", item);
            item["c3"].Text.ShouldBe("yoni");
            mt.GetValue(mt.c, mt.a.IsEqualTo(1)).ShouldBe("yoni");
        }
        [TestMethod]
        public void TestViewModelHelper_2()
        {
            var mt = new MockTable();
            mt.Truncate();
            mt.InsertRow(1, 1, "noam");
            mt.InsertRow(2, 2, "yael");
            var vmc = new TestVMH();
            var item = vmc.GetRows();
            vmc.Delete(item[0]["id"].Text);
            mt.CountRows().ShouldBe(1);
            new BusinessProcess { From = mt }.ForFirstRow(() => mt.c.ShouldBe("yael"));

        }
        [TestMethod]
        public void TestViewModelHelper_post()
        {
            var mt = new MockTable();
            mt.Truncate();
            mt.InsertRow(1, 1, "noam");
            mt.InsertRow(2, 2, "yael");
            var vmc = new TestVMH();
            var i = new DataItem();
            i.Set("c2", 2);
            i.Set("c3", "yael");
            i = vmc.Insert(i);
            mt.CountRows().ShouldBe(3);
            i["id"].Number.ShouldBe(3);



        }
        [TestMethod]
        public void Test_Issue_5()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            t.c.Caption = "מזהה";
            vmh.From = t;
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "mzaa");

        }
        [TestMethod]
        public void TestSingularNames()
        {
            using (var t = new BulkTester((x, r) => NameFixer.MakeSingular(x).ShouldBe(r, x)))
            {
                t.Test("categories", "category");
                t.Test("products", "product");
                t.Test("CATEGORIES", "CATEGORY");
                t.Test("PRODUCTS", "PRODUCT");
                t.Test("NOAM", "NOAM");

            }
        }
        [TestInitialize]
        public void TestInitialize()
        {
            ViewModel.HttpContext.Value = new MockHttpContext();
        }
    }


}
