using System.Collections.Generic;
using Geo4Students.Models.Domain.Determinatietabellen.Parameters;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.ViewModels
{
    public class VragenViewModel
    {
        public VragenViewModel(Klimatogram k)
        {
            Klimatogram = k;
        }

        public List<ParameterViewModel> Parameters { get; set; }
        public Klimatogram Klimatogram { get; set; }
    }

    public class ParameterViewModel
    {
        public ParameterViewModel(Parameter p, Klimatogram km)
        {
            JuisteAntwoord = p.Execute(km);
            MogelijkeAntwoorden = p.GeefMogelijkeAntwoorden(km);
            Omschrijving = p.Omschrijving;
        }

        public List<string> JuisteAntwoord { get; set; }
        public List<string> MogelijkeAntwoorden { get; set; }
        public string Omschrijving { get; set; }
    }
}