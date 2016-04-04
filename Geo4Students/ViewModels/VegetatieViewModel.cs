using System.Collections.Generic;
using Geo4Students.Models.Domain.Determinatietabellen;

namespace Geo4Students.ViewModels
{
    public class VegetatieViewModel
    {
        public DeterminatieResultaat DeterminatieResultaat { get; set; }
        public IList<DeterminatieResultaat> Resultaten { get; set; }
        public object SelectedVegetatieKenmerk { get; set; }
        public DeterminatieViewModel DeterminatieViewModel { get; set; }
    }
}