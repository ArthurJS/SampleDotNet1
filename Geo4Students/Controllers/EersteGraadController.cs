using System.Linq;
using System.Web.Mvc;
using Geo4Students.Models.Domain;
using Geo4Students.Models.Domain.Determinatietabellen;
using Geo4Students.Models.Domain.Klimatogrammen;
using Geo4Students.Models.Repository;
using Geo4Students.ViewModels;

namespace Geo4Students.Controllers
{
    public class EersteGraadController : Controller
    {
        private readonly IGenericRepository<Klimatogram> _klimatogramRepository;

        public EersteGraadController(IGenericRepository<Klimatogram> klimatogramRepository)
        {
            _klimatogramRepository = klimatogramRepository;
        }

        public ActionResult Index(Jaar jaar)
        {
            return View(new KlimatogramViewModel
            {
                Continenten = new SelectList(jaar.Continenten, "ContinentId", "Naam")
            });
        }

        public ActionResult ShowKlimatogramVragen(Jaar jaar, int klimatogramId)
        {
            var klimatogram = _klimatogramRepository.Get(klimatogramId);

            return PartialView("_KlimatogramVragen", new VragenViewModel(klimatogram)
            {
                Parameters = ParameterFactory.FindAll().Select(a => new ParameterViewModel(a, klimatogram)).ToList()
            });
        }
    }
}