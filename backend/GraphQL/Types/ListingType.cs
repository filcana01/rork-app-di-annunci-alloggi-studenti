using StudentHousingAPI.Models;

namespace StudentHousingAPI.GraphQL.Types
{
    public class ListingType : ObjectType<Listing>
    {
        protected override void Configure(IObjectTypeDescriptor<Listing> descriptor)
        {
            descriptor.Field(l => l.Id).Type<NonNullType<IdType>>();
            descriptor.Field(l => l.UserId).Type<NonNullType<IntType>>();
            descriptor.Field(l => l.CategoryId).Type<NonNullType<IntType>>();
            descriptor.Field(l => l.Title).Type<NonNullType<StringType>>();
            descriptor.Field(l => l.Description).Type<NonNullType<StringType>>();
            descriptor.Field(l => l.Address).Type<NonNullType<StringType>>();
            descriptor.Field(l => l.PostalCode).Type<NonNullType<StringType>>();
            descriptor.Field(l => l.City).Type<NonNullType<StringType>>();
            descriptor.Field(l => l.Country).Type<NonNullType<StringType>>();
            descriptor.Field(l => l.Latitude).Type<DecimalType>();
            descriptor.Field(l => l.Longitude).Type<DecimalType>();
            descriptor.Field(l => l.SurfaceArea).Type<IntType>();
            descriptor.Field(l => l.NumberOfRooms).Type<IntType>();
            descriptor.Field(l => l.Floor).Type<IntType>();
            descriptor.Field(l => l.NumberOfBathrooms).Type<IntType>();
            descriptor.Field(l => l.FurnishingStatus).Type<EnumType<FurnishingStatus>>();
            descriptor.Field(l => l.MonthlyRent).Type<NonNullType<DecimalType>>();
            descriptor.Field(l => l.ExpensesIncluded).Type<NonNullType<BooleanType>>();
            descriptor.Field(l => l.MonthlyExpenses).Type<DecimalType>();
            descriptor.Field(l => l.AnnualAdjustment).Type<NonNullType<BooleanType>>();
            descriptor.Field(l => l.HasTerrace).Type<NonNullType<BooleanType>>();
            descriptor.Field(l => l.HasGarden).Type<NonNullType<BooleanType>>();
            descriptor.Field(l => l.PetsAllowed).Type<NonNullType<BooleanType>>();
            descriptor.Field(l => l.AvailabilityDate).Type<NonNullType<DateTimeType>>();
            descriptor.Field(l => l.IsAvailableImmediately).Type<NonNullType<BooleanType>>();
            descriptor.Field(l => l.MinContractDuration).Type<IntType>();
            descriptor.Field(l => l.Rules).Type<StringType>();
            descriptor.Field(l => l.Accessibility).Type<StringType>();
            descriptor.Field(l => l.SecurityDeposit).Type<DecimalType>();
            descriptor.Field(l => l.AcceptsSwissCaution).Type<NonNullType<BooleanType>>();
            descriptor.Field(l => l.Status).Type<NonNullType<EnumType<ListingStatus>>>();
            descriptor.Field(l => l.IsVerified).Type<NonNullType<BooleanType>>();
            descriptor.Field(l => l.CreatedAt).Type<NonNullType<DateTimeType>>();
            descriptor.Field(l => l.UpdatedAt).Type<NonNullType<DateTimeType>>();
            
            // Navigation properties
            descriptor.Field(l => l.User).Type<UserType>();
            descriptor.Field(l => l.Category).Type<CategoryType>();
            descriptor.Field(l => l.Images).Type<ListType<ListingImageType>>();
            descriptor.Field(l => l.Favorites).Type<ListType<FavoriteType>>();
            descriptor.Field(l => l.Messages).Type<ListType<MessageType>>();
        }
    }
}