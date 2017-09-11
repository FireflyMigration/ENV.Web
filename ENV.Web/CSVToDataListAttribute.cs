using System;
using System.Web.Mvc;
using Firefly.Box;
using ENV.IO;
namespace ENV.Web
{
    public class CSVToDataListAttribute : ActionFilterAttribute
    {
        CaptureCSVToDataList _printCapture;
        char _seperator;
        public CSVToDataListAttribute(char seperator = ',')
        {
            _seperator = seperator;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            _printCapture = new CaptureCSVToDataList(_seperator);

            base.OnActionExecuting(filterContext);
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            DataResult r = _printCapture.GetDataList();
            r.DoResult(filterContext.HttpContext.Response);

            base.OnActionExecuted(filterContext);
        }
        public class CaptureCSVToDataList : ITextWriter
        {
            static ContextStatic<Func<string, System.Text.Encoding, FileWriter, Func<ITextWriter>>> _threadFileWriterFactory = new ContextStatic<Func<string, System.Text.Encoding, FileWriter, Func<ITextWriter>>>();
            public static void Init()
            {
                var originalFileWriterFactory = ENV.IO.FileWriter._fileWriterFactory;

                ENV.IO.FileWriter._fileWriterFactory = (filename, encoding, fw) =>
                {
                    var currentValue = _threadFileWriterFactory.Value;
                    if (currentValue != null)
                        return currentValue(filename, encoding, fw);
                    return originalFileWriterFactory(filename, encoding, fw);
                };
            }
            System.IO.StringWriter _sw = new System.IO.StringWriter();
            char _seperator;
            public CaptureCSVToDataList(char seperator)
            {
                _seperator = seperator;
                _threadFileWriterFactory.Value = (filename, encoding, fw) => () => this;
            }
            public void Dispose()
            {

            }
            public DataList GetDataList()
            {
                using (var sr = new System.IO.StringReader(_sw.ToString()))
                {
                    var dl = new DataList();
                    string[] headers = null;
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        if (headers == null)
                        {
                            headers = line.Split('.');
                        }
                        else
                        {
                            var data = line.Split(',');
                            var item = dl.AddItem();
                            for (int i = 0; i < data.Length; i++)
                            {
                                item.Set(headers[i], data[i]);
                            }
                        }

                    }
                    return dl;
                }
            }

            public void Write(string s)
            {
                _sw.Write(s);
            }

            public void WriteInitBytes(byte[] obj)
            {

            }
        }

    }
}