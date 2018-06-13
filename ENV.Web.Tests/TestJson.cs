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
            parsed.Get("ir").ToString().ShouldBe("גבעתיים");
        }

        [TestMethod]
        public void Test3()
        {
            var original = (DataList)new JsonParser().FromJson(json2);
            var parsed = DataList.FromJson(json2);

            parsed.ToJson().ShouldBe(original.ToJson());
        }

        const string json1 = @"{
    ""az_kodMsmkh"": 73,
    ""az_mspr"": 64385,
    ""az_kodLkoach_abor_mshlm_"": 200373,
    ""az_kodLkoach_lkbod_"": 200372}";

        const string json = @"{
    ""az_kodMsmkh"": 73,
    ""az_mspr"": 64385,
    ""az_kodLkoach_abor_mshlm_"": 200373,
    ""az_kodLkoach_lkbod_"": 200372,
    ""az_shmLkoach_lkbod_"": ""גומי ת\""א בע\""מ"",
    ""az_tarikhRishom"": ""2018-04-24"",
    ""az_shatRishom"": ""10:45:19"",
    ""az_tarikhPronMshoar"": ""2018-04-24"",
    ""az_tarikhAspka"": """",
    ""az_msprAzmntkm"": """",
    ""az_ozmnI_ishKshr"": """",
    ""az_opkI"": ""מוטי"",
    ""az_sakKmotBazmna"": 2,
    ""az_sakLpniMam"": 364,
    ""az_sakAchriAncha"": 364,
    ""az_skomMam"": 61.88,
    ""az_sakAchriMam"": 425.88,
    ""az_msprShoraAchrona"": 1,
    ""az_sttos_2_"": 1,
    ""az_mtba"": ""NIS"",
    ""az_sharMtba"": 1,
    ""az_prtiMshloach"": """",
    ""az_msprAatkAdpsa"": 1,
    ""az_mnml_61_"": 0,
    ""az_adNml_61_"": 0,
    ""az_mchsn"": 1,
    ""az_snifMosrot"": 1,
    ""az_tniTshlom_69_"": 1,
    ""az_aarot"": """",
    ""az_ch_p_Lkoach"": 511048662,
    ""id"": 91350,
    ""ms_Lkoach"": 200373,
    ""shmLkoach"": ""גרופין 2000 בע\""מ"",
    ""shmLkoachAngli"": """",
    ""rchov"": ""רמה 33"",
    ""ir"": ""גבעתיים"",
    ""mikod"": ""53320"",
    ""tlpon1"": ""0357878012"",
    ""pks"": ""03-5787803"",
    ""anchtLkoach"": 0,
    ""obligo"": 0,
    ""mksimomObligoMoshr"": 118506.74,
    ""ms_KrtisAnaach"": 0,
    ""chovLkoach"": 56000,
    ""tniTshlom_69_"": 0,
    ""soknMkirot_mchsn"": 0,
    ""c_O_C"": false,
    ""chsimtLkoachBchov"": """",
    ""msprCh_p_t_z_mosdMmshlti"": 512901489,
    ""k_uniqueident"": 395,
    ""chshbonitBdoal"": false,
    ""ktobtDoal"": ""office@grupin.co.il"",
    ""mchsnKons"": 0,
    ""spkShlMosrot"": false,
    ""shmLkoach1"": ""גרופין 2000 בע\""מ""
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
