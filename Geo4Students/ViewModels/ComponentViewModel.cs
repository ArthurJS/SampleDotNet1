using Geo4Students.Models.Domain.Determinatietabellen;

namespace Geo4Students.ViewModels
{
    public class ComponentViewModel
    {
        public DeterminatieComponent DeterminatieComponent { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int MaxY { get; set; }
        public ComponentViewModel Parent { get; set; }
    }
}