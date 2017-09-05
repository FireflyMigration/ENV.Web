using ENV.Printing;
using ENV.Labs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using Firefly.Box;
using ENV.IO;

namespace WebDemo.Utils
{
    public class DataResult : System.Web.Mvc.ActionResult
    {
        ISerializedObject _r;
        Func<HttpResponseBase, TextWriter, ISerializedObjectWriter> _getWriter;
        public DataResult(ISerializedObject r, Func<HttpResponseBase, TextWriter, ISerializedObjectWriter> getWriter)
        {
            _getWriter = getWriter;
            _r = r;
        }


        public static implicit operator DataResult(DataList dl)
        {
            return ToResult(dl);
        }
        static DataResult ToResult(ISerializedObject r)
        {
            var response = System.Web.HttpContext.Current.Request.Params["_response"] ?? "J";
            response = response.ToUpper();
            switch (response[0])
            {
                case 'X':
                    return ToXmlResult(r);
                case 'C':
                    return ToCsvResult(r);
                case 'H':
                    return ToHTMLResult(r);
                default:
                    return ToJsonResult(r);
            }

        }



        static DataResult ToJsonResult(ISerializedObject r)
        {

            return new DataResult(r, (response, sw) =>
            {
                response.ContentType = "application/json";
                return new JsonISerializedObjectWriter(sw);
            });
        }
        static DataResult ToXmlResult(ISerializedObject r)
        {
            return new DataResult(r, (response, sw) =>
            {
                response.ContentType = "text/xml";
                return new XmlISerializedObjectWriter(new XmlTextWriter(sw));
            });
        }

        static DataResult ToCsvResult(ISerializedObject r, string downloadFileName = "data.csv")
        {
            return new DataResult(r, (response, sw) =>
            {
                response.ContentType = "application/csv";
                response.AddHeader("Content-Disposition", "attachment;filename=" + downloadFileName);
                return new CSVISerializedObjectWriter(sw);
            });
        }
        static DataResult ToHTMLResult(ISerializedObject r)
        {
            return new DataResult(r, (response, sw) =>
            {
                response.ContentType = "text/html";

                return new HTMLISerializedObjectWriter(sw);
            });
        }
        public override void ExecuteResult(System.Web.Mvc.ControllerContext context)
        {



            HttpResponseBase response = context.HttpContext.Response;



            DoResult(response);



        }

        internal void DoResult(HttpResponseBase response)
        {
            using (var sw = new StringWriter())
            {
                var ser = _getWriter(response, sw);
                _r.ToWriter(ser);
                ser.Dispose();
                response.Write(sw.ToString());
            }
        }
    }
    public class PrintToPDFAttribute : ActionFilterAttribute
    {
        PrinterWriter.CapturePDFPrinting _printCapture;

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            _printCapture = new PrinterWriter.CapturePDFPrinting();

            base.OnActionExecuting(filterContext);
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {

            filterContext.Result = new FileStreamResult(_printCapture.GetResult(),
                System.Net.Mime.MediaTypeNames.Application.Pdf);
            base.OnActionExecuted(filterContext);
        }
    }
    public class CSVToDataListAttribute : ActionFilterAttribute
    {
        CaptureCSVToDataList _printCapture;
        char _seperator;
        public CSVToDataListAttribute(char seperator = ',') {
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