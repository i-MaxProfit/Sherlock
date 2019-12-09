using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Api.Gax.Grpc;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Dialogflow.V2;
using Grpc.Auth;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DialogFlow.Controllers
{
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ApiController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("api/sendtext")]
        public async Task<IActionResult> sendtext(string text, string sessionId)
        {
            var result = new RequestResult();

            try
            {
                var query = new QueryInput { Text = new TextInput { Text = text, LanguageCode = "ru-ru" } };

                var agent = "small-talk-1-cdboby";
                var creds = GoogleCredential.FromFile($"{_env.WebRootPath}\\DFCredits.json");
                var channel = new Grpc.Core.Channel(SessionsClient.DefaultEndpoint.Host, creds.ToChannelCredentials());

                var client = SessionsClient.Create(channel);
                var dialogFlow = await client.DetectIntentAsync(new SessionName(agent, sessionId), query);
                await channel.ShutdownAsync();

                result.IsSuccess = true;
                result.Data = string.IsNullOrEmpty(dialogFlow?.QueryResult?.FulfillmentText) ? GetRandomDontKnow() : dialogFlow.QueryResult.FulfillmentText;
            }
            catch (Exception err)
            {
                result.IsSuccess = false;
                result.Data = "Упс... что-то пошло не так...";
                result.Error = $"Ошбика: {err.Message}";
            }

            return new JsonResult(result);
        }

        //Возвращает одну из фраз о том, что бот не понял вопроса
        private string GetRandomDontKnow()
        {
            var list = new List<string>();
            list.Add("Прости, но я не понимаю тебя...");
            list.Add("Извини, я не понимаю. Попробуй сказать как-то иначе, пожалуйста.");
            list.Add("Хм... что ты имеешь ввиду?");
            list.Add("К сожалению, я тебе не совсем пониманимаю. Скажи иначе, что ты хочешь?");
            list.Add("Сорри, ты о чем?");
            list.Add("Похоже я тебя не понял. Попробуй сказать по-другому");

            return list[new Random().Next(list.Count)];
        }

        public class RequestResult
        {
            public bool IsSuccess { get; set; }
            public string Data { get; set; }
            public string Error { get; set; }
        }
    }
}
