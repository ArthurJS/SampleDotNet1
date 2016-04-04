using System.Linq;
using System.Web;
using System.Web.Mvc;
using Geo4Students.Models.Domain;
using Geo4Students.ViewModels;

namespace Geo4Students.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(Jaar jaar)
        {
            if (jaar.Leerjaar == 0)
            {
                return RedirectToAction("Jaar", "Home");
            }
            return RedirectToAction("Start", "Home");
        }

        public ActionResult Start(Jaar jaar)
        {
            return View("Start");
        }

        public ActionResult Jaar()
        {
            string[] jaren =
            {
                "1ste jaar",
                "2de jaar",
                "3de jaar",
                "4de jaar",
                "5de jaar",
                "6de jaar"
            };
            var jaarViewModel = new JaarViewModel
            {
                SubjectList = jaren.ToList()
            };
            return View(jaarViewModel);
        }

        [HttpPost, ActionName("Jaar")]
        public ActionResult JaarConfirmed(JaarViewModel model)
        {
            if (model.SelectedJaar == null)
            {
                return RedirectToAction("Jaar");
            }
            HttpContext.Response.Cookies.Add(new HttpCookie("jaar", model.SelectedJaar.Substring(0, 1)));
            return RedirectToAction("Start", "Home");
        }
    }
}