using Geo4Students.Models.Domain.Determinatietabellen;

namespace Geo4Students.ViewModels
{
    public class DerdeGraadViewModel
    {
        private readonly int[] _connections = new int[6] {-1, -1, -1, -1, -1, -1};
        public Determinatietabel Determinatietabel;
        public KlimatogramViewModel[] KlimatogramVm = new KlimatogramViewModel[6];

        public void SetConnection(int klimatogram, int punt)
        {
            _connections[klimatogram] = punt;
        }

        public bool HasConnection(int klimatogram)
        {
            return _connections[klimatogram] != -1;
        }
    }
}