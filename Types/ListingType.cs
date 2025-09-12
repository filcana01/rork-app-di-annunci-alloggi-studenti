using HousingAPI.Business.Model;

namespace HousingAPI.GraphQLModels.Type
{
    public class ListingType : ObjectGraphType<ListingModel>
    {
        public ListingType()
        {
            Name = nameof(ListingModel);
            Field(x => x.Id);
            Field(x => x.UserId);
            Field(x => x.CategoryId);
            Field(x => x.Title);
            Field(x => x.Description);
            Field(x => x.Address);
            Field(x => x.PostalCode);
            Field(x => x.City);
            Field(x => x.Country);
            Field(x => x.Latitude, nullable: true);
            Field(x => x.Longitude, nullable: true);
            Field(x => x.SurfaceArea);
            Field(x => x.NumberOfRooms, nullable: true);
            Field(x => x.Floor);
            Field(x => x.NumberOfBathrooms, nullable: true);
            Field(x => x.FurnishingStatus);
            Field(x => x.MonthlyRent);
            Field(x => x.ExpensesIncluded);
            Field(x => x.MonthlyExpenses, nullable: true);
            Field(x => x.AnnualAdjustment);
            Field(x => x.HasTerrace);
            Field(x => x.HasGarden);
            Field(x => x.HasPool);
            Field(x => x.PetsAllowed);
            Field(x => x.AvailabilityDate);
            Field(x => x.IsAvailableImmediately);
            Field(x => x.MinContractDuration, nullable: true);
            Field(x => x.Rules, nullable: true);
            Field(x => x.HasElevator);
            Field(x => x.HasRampAccess);
            Field(x => x.SecurityDeposit, nullable: true);
            Field(x => x.AcceptsSwissCaution);
            Field(x => x.Status);
            Field(x => x.VerifiedAt, nullable: true);
            Field(x => x.CreatedAt);
            Field(x => x.UpdatedAt);
            Field(x => x.DeletedAt, nullable: true);
        }
    }
}