using Geo4Students.Models.Domain.Determinatietabellen;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.ViewModels
{
    public class OefeningDeterminatieViewModel
    {
        public Klimatogram Klimatogram { get; set; }
        public Determinatietabel Determinatietabel { get; set; }
        public DeterminatieViewModel DeterminatieViewModel { get; set; }
        public KlimatogramViewModel KlimatogramViewModel { get; set; }
        public int Jaar { get; set; }

        public DeterminatieResultaat JuisteResultaat()
        {
            return Determinatietabel.Determineer(Klimatogram);
        }
    }
}