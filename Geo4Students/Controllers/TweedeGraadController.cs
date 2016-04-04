using System.Web.Mvc;
using Geo4Students.Models.Domain;
using Geo4Students.Models.Domain.Klimatogrammen;
using Geo4Students.Models.Repository;
using Geo4Students.ViewModels;

namespace Geo4Students.Controllers
{
    public class TweedeGraadController : Controller
    {
        private readonly IGenericRepository<Klimatogram> _klimatogramRepository;

        public TweedeGraadController(IGenericRepository<Klimatogram> klimatogramRepository)
        {
            _klimatogramRepository = klimatogramRepository;
        }

        public ActionResult Index(Jaar jaar)
        {
            return View(new OefeningDeterminatieViewModel
            {
                Determinatietabel = jaar.Determinatietabel,
                Jaar = jaar.Leerjaar,
                DeterminatieViewModel = new DeterminatieViewModel(jaar.Determinatietabel),
                KlimatogramViewModel = new KlimatogramViewModel
                {
                    Continenten = new SelectList(jaar.Continenten, "ContinentId", "Naam")
                }
            });
        }

        public ActionResult ShowOefeningTabel(Jaar jaar, int klimatogramId)
        {
            return PartialView("../TweedeGraad/_OefeningTabel", new OefeningDeterminatieViewModel
            {
                Determinatietabel = jaar.Determinatietabel,
                Klimatogram = _klimatogramRepository.Get(klimatogramId),
                Jaar = jaar.Leerjaar,
                DeterminatieViewModel = new DeterminatieViewModel(jaar.Determinatietabel)
            });
        }

        public ActionResult ShowOefeningVegetatie(Jaar jaar, int klimatogramId)
        {
            return PartialView("../TweedeGraad/_OefeningVegetatie", new OefeningDeterminatieViewModel
            {
                Determinatietabel = jaar.Determinatietabel,
                Klimatogram = _klimatogramRepository.Get(klimatogramId),
                Jaar = jaar.Leerjaar,
                DeterminatieViewModel = new DeterminatieViewModel(jaar.Determinatietabel)
            });
        }

        public ActionResult ShowGoedeAntwoord(Jaar jaar, int klimatogramId)
        {
            return PartialView("../TweedeGraad/_GoedeAntwoord", new OefeningDeterminatieViewModel
            {
                Determinatietabel = jaar.Determinatietabel,
                Klimatogram = _klimatogramRepository.Get(klimatogramId),
                Jaar = jaar.Leerjaar,
                DeterminatieViewModel = new DeterminatieViewModel(jaar.Determinatietabel)
            });
        }

        public ActionResult UpdateKlimatogram(int klimatogramId)
        {
            return PartialView("_Klimatogram",
                new KlimatogramViewModel {Klimatogram = _klimatogramRepository.Get(klimatogramId)});
        }
    }
}