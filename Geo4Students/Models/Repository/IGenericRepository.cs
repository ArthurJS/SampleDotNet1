using System.Linq;

namespace Geo4Students.Models.Repository
{
    public interface IGenericRepository<T>
    {
        IQueryable<T> FindAll();
        T Get(object id);
        void Delete(T obj);
        void Insert(T obj);
        bool Exists(object id);
        void SaveChanges();
    }
}