using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using StudentHousingAPI.Data;
using StudentHousingAPI.Services;
using StudentHousingAPI.GraphQL;
using StudentHousingAPI.GraphQL.Types;
using StudentHousingAPI.GraphQL.Queries;
using StudentHousingAPI.GraphQL.Mutations;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// GraphQL
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddType<UserType>()
    .AddType<ListingType>()
    .AddType<CategoryType>()
    .AddType<MessageType>()
    .AddType<FavoriteType>()
    .AddType<ListingImageType>()
    .AddType<AuthPayloadType>()
    .AddFiltering()
    .AddSorting()
    .AddProjections();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Services
builder.Services.AddScoped<IListingService, ListingService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactNativeApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactNativeApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// GraphQL endpoint
app.MapGraphQL("/graphql");

app.Run();