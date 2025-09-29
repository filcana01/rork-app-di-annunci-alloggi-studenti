using GraphQL.Types;
using HousingAPI.GraphQLModels.Mutations.Inputs;

namespace HousingAPI.GraphQLModels.Mutations.InputTypes
{
    public class CreateListingInputGraphType : InputObjectGraphType<CreateListingInput>
    {
        public CreateListingInputGraphType()
        {
            Name = "CreateListingInput";
            Description = "Input for creating a new listing";

            Field(x => x.UserId).Description("ID of the user creating the listing");
            Field(x => x.CategoryId).Description("Category ID for the listing");
            Field(x => x.Title).Description("Listing title");
            Field(x => x.Description).Description("Listing description");
            Field(x => x.Address).Description("Property address");
            Field(x => x.PostalCode).Description("Postal code");
            Field(x => x.City).Description("City");
            Field(x => x.Country).Description("Country");
            Field(x => x.Latitude, nullable: true).Description("Latitude coordinate");
            Field(x => x.Longitude, nullable: true).Description("Longitude coordinate");
            Field(x => x.SurfaceArea).Description("Surface area in square meters");
            Field(x => x.NumberOfRooms, nullable: true).Description("Number of rooms");
            Field(x => x.Floor).Description("Floor number");
            Field(x => x.NumberOfBathrooms, nullable: true).Description("Number of bathrooms");
            Field(x => x.FurnishingStatus).Description("Furnishing status (0=Unfurnished, 1=PartiallyFurnished, 2=Furnished)");
            Field(x => x.MonthlyRent).Description("Monthly rent amount");
            Field(x => x.ExpensesIncluded).Description("Whether expenses are included in rent");
            Field(x => x.MonthlyExpenses, nullable: true).Description("Monthly expenses amount");
            Field(x => x.AnnualAdjustment).Description("Whether annual adjustment applies");
            Field(x => x.HasTerrace).Description("Whether property has a terrace");
            Field(x => x.HasGarden).Description("Whether property has a garden");
            Field(x => x.HasPool).Description("Whether property has a pool");
            Field(x => x.PetsAllowed).Description("Whether pets are allowed");
            Field(x => x.AvailabilityDate).Description("Date when property becomes available");
            Field(x => x.IsAvailableImmediately).Description("Whether property is available immediately");
            Field(x => x.MinContractDuration, nullable: true).Description("Minimum contract duration in months");
            Field(x => x.Rules, nullable: true).Description("Property rules");
            Field(x => x.HasElevator).Description("Whether building has elevator");
            Field(x => x.HasRampAccess).Description("Whether building has ramp access");
            Field(x => x.SecurityDeposit, nullable: true).Description("Security deposit amount");
            Field(x => x.AcceptsSwissCaution).Description("Whether Swiss caution is accepted");
        }
    }
}