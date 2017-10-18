using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using ENV.Utilities;

namespace WebDemo.Controllers
{
    public class ProfilerController : Controller
    {
        // GET: ProfilerController
        public ActionResult Index()
        {
            return View();
        }
        public static void Init()
        {
            ProfilerPath = Profiler.ProfilerFile;


            if (!string.IsNullOrEmpty(ProfilerPath))
            {
                ProfilerPath = Path.GetDirectoryName(ProfilerPath);
            }
            else
            {
                ProfilerPath = Environment.CurrentDirectory;
            }
            ProfilerPath = Path.Combine(ProfilerPath, "webDemoProfilerFiles") + "\\";
            Directory.CreateDirectory(ProfilerPath);

            Profiler.ProfilerFile = "";

        }
        public static string ProfilerPath;
        public string Start()
        {
            ENV.Utilities.Profiler.ProfilerFile = ProfilerPath;
            return "Started";
        }
        public string Stop()
        {
            ENV.Utilities.Profiler.ProfilerFile = "";
            return "Stopped";
        }
    }
}