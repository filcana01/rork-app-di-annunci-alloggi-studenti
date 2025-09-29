using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class UpdateListingInputGraphType : InputObjectGraphType<UpdateListingInput>
    {
        public UpdateListingInputGraphType()
        {
            Name = "UpdateListingInput";
            Description = "Input for updating an existing listing";

            Field(x => x.Id).Description("Listing ID to update");
            Field(x => x.Title, nullable: true).Description("Listing title");
            Field(x => x.Description, nullable: true).Description("Listing description");
            Field(x => x.Address, nullable: true).Description("Property address");
            Field(x => x.PostalCode, nullable: true).Description("Postal code");
            Field(x => x.City, nullable: true).Description("City");
            Field(x => x.Country, nullable: true).Description("Country");
            Field(x => x.Latitude, nullable: true).Description("Latitude coordinate");
            Field(x => x.Longitude, nullable: true).Description("Longitude coordinate");
            Field(x => x.SurfaceArea, nullable: true).Description("Surface area in square meters");
            Field(x => x.NumberOfRooms, nullable: true).Description("Number of rooms");
            Field(x => x.Floor, nullable: true).Description("Floor number");
            Field(x => x.NumberOfBathrooms, nullable: true).Description("Number of bathrooms");
            Field(x => x.FurnishingStatus, nullable: true).Description("Furnishing status");
            Field(x => x.MonthlyRent, nullable: true).Description("Monthly rent amount");
            Field(x => x.ExpensesIncluded, nullable: true).Description("Whether expenses are included");
            Field(x => x.MonthlyExpenses, nullable: true).Description("Monthly expenses amount");
            Field(x => x.AnnualAdjustment, nullable: true).Description("Whether annual adjustment applies");
            Field(x => x.HasTerrace, nullable: true).Description("Whether property has a terrace");
            Field(x => x.HasGarden, nullable: true).Description("Whether property has a garden");
            Field(x => x.HasPool, nullable: true).Description("Whether property has a pool");
            Field(x => x.PetsAllowed, nullable: true).Description("Whether pets are allowed");
            Field(x => x.AvailabilityDate, nullable: true).Description("Availability date");
            Field(x => x.IsAvailableImmediately, nullable: true).Description("Whether available immediately");
            Field(x => x.MinContractDuration, nullable: true).Description("Minimum contract duration");
            Field(x => x.Rules, nullable: true).Description("Property rules");
            Field(x => x.HasElevator, nullable: true).Description("Whether building has elevator");
            Field(x => x.HasRampAccess, nullable: true).Description("Whether building has ramp access");
            Field(x => x.SecurityDeposit, nullable: true).Description("Security deposit amount");
            Field(x => x.AcceptsSwissCaution, nullable: true).Description("Whether Swiss caution is accepted");
            Field(x => x.Status, nullable: true).Description("Listing status");
        }
    }
}