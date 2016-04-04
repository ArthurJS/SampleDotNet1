using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web.Mvc;
using System.Web.WebPages;
using Geo4Students.Models.Domain;
using Geo4Students.Models.Domain.Klimatogrammen;
using Geo4Students.ViewModels;
using WebGrease.Css.Extensions;

namespace Geo4Students.Controllers
{
    public class DerdeGraadController : Controller
    {
        public ActionResult Index(Jaar jaar)
        {
            var viewModel = new DerdeGraadViewModel
            {
                Determinatietabel = jaar.Determinatietabel
            };
            Session["_derdeGraadViewModel"] = viewModel;

            var idx = 0;

            GeefRandomKlimatogrammen(jaar).ForEach(i =>
            {
                Debug.WriteLine(i + " " + i.Naam);

                viewModel.KlimatogramVm[idx] = new KlimatogramViewModel
                {
                    Klimatogram = i,
                    SelectedKlimatogramId = idx
                };
                idx++;
            });
            return View("Index", viewModel);
        }

        private Klimatogram[] GeefRandomKlimatogrammen(Jaar jaar)
        {
            //var random = new Random();

            //var klimatogrammen = _klimatogramRepository.FindAll().ToList();

            //for(var i = 0; i < klimatogrammen.Count * 10; ++i) {
            //    var randomPos = random.Next(0, klimatogrammen.Count);

            //    var klimatogram = klimatogrammen.ElementAt(randomPos);

            //    klimatogrammen.RemoveAt(randomPos);
            //    klimatogrammen.Add(klimatogram);
            //}
            //return klimatogrammen.GetRange(0, 6).ToArray();
            var klimatogrammen = new List<Klimatogram>();

            foreach (var continent in jaar.Continenten)
            {
                klimatogrammen.Add(continent.GeefRandomLocatie());
            }
            return klimatogrammen.ToArray();
        }

        public ActionResult UpdateKlimatogram(int klimatogramId)
        {
            var viewModel = Session["_derdeGraadViewModel"] as DerdeGraadViewModel;

            return PartialView("_Klimatogram", viewModel.KlimatogramVm[klimatogramId]);
        }

        public ActionResult ControleerVegetatieTypes(string[] antwoorden)
        {
            var viewModel = Session["_derdeGraadViewModel"] as DerdeGraadViewModel;

            var resultaten = new bool[6];

            for (var i = 0; i < antwoorden.Length; ++i)
            {
                var juisteAntwoord =
                    viewModel.Determinatietabel.Determineer(viewModel.KlimatogramVm[i].Klimatogram).VegetatieKenmerk;

                if (antwoorden[i].IsEmpty() || juisteAntwoord.IsEmpty())
                {
                    return Json(resultaten, JsonRequestBehavior.AllowGet);
                }
                if (LevenshteinDistance(juisteAntwoord.ToLower(), antwoorden[i].ToLower()) < 4)
                {
                    resultaten[i] = true;
                }
                Debug.WriteLine(antwoorden[i] + " <=> " + juisteAntwoord + " " + resultaten[i]);
            }
            return Json(resultaten, JsonRequestBehavior.AllowGet);
        }

        private int LevenshteinDistance(string s, string t)
        {
            var n = s.Length;
            var m = t.Length;
            var d = new int[n + 1, m + 1];

            if (n == 0)
            {
                return m;
            }

            if (m == 0)
            {
                return n;
            }

            for (var i = 0; i <= n; d[i, 0] = i++)
            {
            }

            for (var j = 0; j <= m; d[0, j] = j++)
            {
            }

            for (var i = 1; i <= n; i++)
            {
                for (var j = 1; j <= m; j++)
                {
                    var cost = (t[j - 1] == s[i - 1]) ? 0 : 1;

                    d[i, j] = Math.Min(
                        Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                        d[i - 1, j - 1] + cost);
                }
            }
            return d[n, m];
        }
    }
}