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
        [TestMethod]
        public void TestInsertOneRow()
        {
            var mt = new MockTable();
            mt.Truncate();
            mt.InsertRow(1, 1, "Noam");
            mt.InsertRow(2, 2, "Yael");
            mt.InsertRow(3, 3, "Yoni");
            var vmh = new ViewModel { From = mt };
            var d = vmh.ExportRows();
            mt.Truncate();
            mt.CountRows().ShouldBe(0);
            vmh.Insert(d[0]);
            mt.CountRows().ShouldBe(1);
        }
        [TestMethod]
        public void TestHandlingOfDuplicateRows()
        {
            var mt = new MockTable();
            mt.Truncate();
            mt.InsertRow(1, 1, "Noam");
            mt.InsertRow(2, 2, "Yael");
            mt.InsertRow(3, 3, "Yoni");
            var vmh = new ViewModel { From = mt };
            var d = vmh.ExportRows();
            mt.Delete(mt.a.IsDifferentFrom(2));
            mt.CountRows().ShouldBe(1);
            vmh.ImportRows(d, ignoreDuplicateRows: true);
            mt.CountRows().ShouldBe(3);
        }
        [TestMethod]
        public void TestVMHExportImport()
        {
            var mt = new MockTable();
            mt.Truncate();
            mt.InsertRow(1, 1, "Noam");
            mt.InsertRow(2, 2, "Yael");

            var vmh = new ViewModel() { From = mt };
            var dl = vmh.ExportRows();
            mt.Truncate();
            mt.CountRows().ShouldBe(0);
            vmh = new ViewModel() { From = mt };
            vmh.ImportRows(dl);
            var i = 0;
            mt.ForEachRow(null, new Sort(mt.a), () =>
            {
                mt.a.ShouldBe(new Number[] { 1, 2 }[i]);
                mt.b.ShouldBe(new Number[] { 1, 2 }[i]);
                mt.c.ShouldBe(new string[] { "Noam", "Yael" }[i]);
                i++;
            }).ShouldBe(2);
        }

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
                if (Activity == Activities.Insert)
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
            var dl = vmc.GetRows(new MockHttpContext());
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
                if (Activity == Activities.Insert)
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
            var dl = vmc.GetRows(new MockHttpContext());
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
            var item = vmc.GetRows(new MockHttpContext());
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
            t.c.Name = "";
            vmh.From = t;
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "mzaa");

        }
        [TestMethod]
        public void Test_Issue_6()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            t.c.Caption = "last";
            vmh.From = t;
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "last");

        }
        [TestMethod]
        public void Test_Issue_7()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            t.c.Caption = "last name";
            vmh.From = t;
            vmh.MapColumn(t.c);
            vmh.MapColumn(t.b);
            vmh.AssertColumnKey(t.b, "c2");
            vmh.AssertColumnKey(t.c, "lastName");

        }
        [TestMethod]
        public void Test_Issue_8()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            t.c.Caption = "Last name";
            vmh.From = t;
            vmh.MapColumn(t.a);
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "lastName");
            vmh.AssertColumnKey(t.a, "id");

        }
        [TestMethod]
        public void Test_Issue_9()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            t.c.Caption = "LastName";
            vmh.From = t;
            vmh.MapColumn(t.a);
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "lastName");

        }
        [TestMethod]
        public void Test_Issue_10()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            t.c.Caption = "theOrder";
            vmh.From = t;
            vmh.MapColumn(t.a);
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "theOrder");

        }
        [TestMethod]
        public void Test_Issue_11()
        {
            var vmh = new TestVMH();
            var t = new MockTable();

            vmh.From = t;

            vmh.MapColumn(t.c, "theOrder");
            vmh.AssertColumnKey(t.c, "theOrder");

        }
        [TestMethod]
        public void Test_Issue_12()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            vmh.From = t;
            t.c.Caption = "נועם";
            t.c.Name = "";
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "noam");

        }
        [TestMethod]
        public void Test_Issue_13()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            vmh.From = t;
            t.c.Caption = "נועם";
            t.c.Name = "a_cool_name";
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "aCoolName");

        }
        [TestMethod]
        public void Test_Issue_14()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            vmh.From = t;
            t.c.Caption = "נועם";
            t.c.Name = "A_COOL_NAME";
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "aCoolName");

        }
        [TestMethod]
        public void Test_Issue_15()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            vmh.From = t;
            t.c.Caption = "נועם";
            t.c.Name = "aCoolName";
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "aCoolName");

        }
        [TestMethod]
        public void Test_Issue_16()
        {
            var vmh = new TestVMH();
            var t = new MockTable();
            vmh.From = t;
            t.c.Caption = "נועם";
            t.c.Name = "a_CoolName";
            vmh.MapColumn(t.c);
            vmh.AssertColumnKey(t.c, "aCoolName");

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
                t.Test("NOAM", "NOAMItem");

            }
        }

    }


}
