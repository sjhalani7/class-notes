from openai import OpenAI
import configs.api_keys as config


client = OpenAI(api_key=config.open_ai_api_key)