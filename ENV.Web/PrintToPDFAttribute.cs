using ENV.Printing;
using System.Web.Mvc;
namespace ENV.Web
{
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
}